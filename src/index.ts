import { EventEmitter } from "events";

import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { ClientDuplexStream, credentials, Metadata } from "@grpc/grpc-js";
import { TypedTransaction } from "@ethereumjs/tx";

import eth from "../protobuf/eth_pb";
import { APIClient } from "../protobuf/api_grpc_pb";
import {
  RawTxMsg,
  TransactionResponse as PbResponse,
  TxSequenceMsg,
  TxSequenceResponse,
  RawTxSequenceMsg,
  TxFilter,
} from "../protobuf/api_pb";
import { FilterBuilder } from "./filter";
import {
  BeaconBlock,
  ExecutionPayload,
  ExecutionPayloadHeader,
  fromProtoBeaconBlock,
  fromProtoExecutionHeader,
  fromProtoTx,
  toProtoTx,
  TransactionResponse,
} from "./types";

export class Client {
  private _client: APIClient;
  private _md: Metadata;

  private _txStream: ClientDuplexStream<eth.Transaction, PbResponse>;
  private _rawTxStream: ClientDuplexStream<RawTxMsg, PbResponse>;
  private _txSequenceStream: ClientDuplexStream<
    TxSequenceMsg,
    TxSequenceResponse
  >;
  private _rawTxSequenceStream: ClientDuplexStream<
    RawTxSequenceMsg,
    TxSequenceResponse
  >;

  constructor(target: string, apiKey: string) {
    this._client = new APIClient(target, credentials.createInsecure());
    this._md = new Metadata();
    this._md.add("x-api-key", apiKey);

    this._txStream = this._client.sendTransaction(this._md);
    this._rawTxStream = this._client.sendRawTransaction(this._md);
    this._txSequenceStream = this._client.sendTransactionSequence(this._md);
    this._rawTxSequenceStream = this._client.sendRawTransactionSequence(
      this._md
    );
  }

  waitForReady(seconds: number): Promise<void> {
    const now = new Date();
    const deadline = new Date(now.getTime() + seconds * 1000);

    return new Promise((resolve, reject) => {
      this._client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * subscribes to the new transactions stream.
   * @returns {TxStream} - emits new txs as events
   */
  subscribeNewTxs(filter?: FilterBuilder): TxStream {
    const f = filter ? filter.build() : new Uint8Array();

    const protoFilter = new TxFilter();
    protoFilter.setEncoded(f);
    return new TxStream(this._client, this._md, protoFilter);
  }

  /**
   * subscribes to the new execution headers stream.
   * @returns {ExecutionHeaderStream} - emits new blocks as events (without transactions)
   */
  subscribeNewExecutionHeaders(): ExecutionHeaderStream {
    return new ExecutionHeaderStream(this._client, this._md);
  }

  /**
   * subscribes to the new execution payloads stream.
   * @returns {ExecutionPayloadStream} - emits new blocks as events (with transactions)
   */
  subscribeNewExecutionPayloads(): ExecutionPayloadStream {
    return new ExecutionPayloadStream(this._client, this._md);
  }

  /**
   * subscribes to the new beacon blocks stream.
   * @returns {BeaconBlockStream} - emits new beacon blocks as events
   */
  subscribeNewBeaconBlocks(): BeaconBlockStream {
    return new BeaconBlockStream(this._client, this._md);
  }

  /**
   * sends a transaction
   * @param tx a signed! typed transaction
   * @returns response containing hash and timestamp
   */
  async sendTransaction(tx: TypedTransaction): Promise<TransactionResponse> {
    return new Promise((resolve, reject) => {
      this._txStream.write(toProtoTx(tx), this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._txStream.on("data", (res: PbResponse) => {
            resolve({
              hash: res.getHash(),
              timestamp: res.getTimestamp(),
            });
          });
        }
      });
    });
  }

  /**
   * sends a transaction
   * @param rawtx an array of serialized RLP encoded signed transactions in hexadecimal
   * @returns response containing array of hashes and timestamps
   */
  async sendRawTransaction(rawtx: string): Promise<TransactionResponse> {
    const rawMsg = new RawTxMsg();

    if (rawtx.substring(0, 2) === "0x") {
      rawtx = rawtx.substring(2);
    }

    rawMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, "hex")));
    return new Promise((resolve, reject) => {
      this._rawTxStream.write(rawMsg, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._rawTxStream.on("data", (res: PbResponse) => {
            resolve({
              hash: res.getHash(),
              timestamp: res.getTimestamp(),
            });
          });
        }
      });
    });
  }

  /**
   *
   * @param txs an array of signed! typed transactions
   * @returns response containing array of hashes and timestamps
   */
  async sendTransactionSequence(
    txs: TypedTransaction[]
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new TxSequenceMsg();
    sequenceMsg.setSequenceList(txs.map(toProtoTx));

    return new Promise((resolve, reject) => {
      this._txSequenceStream.write(sequenceMsg, this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._txSequenceStream.on("data", (res: TxSequenceResponse) => {
            let response: TransactionResponse[] = [];
            for (let r of res.getSequenceResponseList()) {
              response.push({
                hash: r.getHash(),
                timestamp: r.getTimestamp(),
              });
            }

            resolve(response);
          });
        }
      });
    });
  }

  /**
   * @param rawTxs an array of signed and serialized transactions
   * @returns response containing array of hashes and timestamps
   */
  async sendRawTransactionSequence(
    rawTxs: string[]
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new RawTxSequenceMsg();

    // remove 0x prefix if present
    for (const [idx, rawtx] of rawTxs.entries()) {
      if (rawtx.substring(0, 2) === "0x") {
        rawTxs[idx] = rawtx.substring(2);
      }
    }

    sequenceMsg.setRawTxsList(
      rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex")))
    );

    return new Promise((resolve, reject) => {
      this._rawTxSequenceStream.write(sequenceMsg, this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._rawTxSequenceStream.on("data", (res: TxSequenceResponse) => {
            let response: TransactionResponse[] = [];
            for (let r of res.getSequenceResponseList()) {
              response.push({
                hash: r.getHash(),
                timestamp: r.getTimestamp(),
              });
            }

            resolve(response);
          });
        }
      });
    });
  }
}

class TxStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata, _filter: TxFilter) {
    super();
    this.retry(_client, _md, _filter);
  }

  async retry(_client: APIClient, _md: Metadata, _filter: TxFilter) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _txStream = _client.subscribeNewTxs(_filter, _md);
    _txStream.on("close", () => this.emit("close"));
    _txStream.on("end", () => this.emit("end"));
    _txStream.on("data", (data: eth.Transaction) =>
      this.emit("data", fromProtoTx(data))
    );

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md, _filter);
    });
  }
}

class ExecutionHeaderStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata) {
    super();
    this.retry(_client, _md);
  }

  async retry(_client: APIClient, _md: Metadata) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _blockStream = _client.subscribeExecutionHeaders(
      new google_protobuf_empty_pb.Empty(),
      _md
    );

    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: eth.ExecutionPayloadHeader) =>
      this.emit("data", this.handleExecutionPayloadHeader(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleExecutionPayloadHeader(
    block: eth.ExecutionPayloadHeader
  ): ExecutionPayloadHeader {
    return fromProtoExecutionHeader(block);
  }
}

class ExecutionPayloadStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata) {
    super();
    this.retry(_client, _md);
  }

  async retry(_client: APIClient, _md: Metadata) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _blockStream = _client.subscribeExecutionPayloads(
      new google_protobuf_empty_pb.Empty(),
      _md
    );

    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: eth.ExecutionPayload) =>
      this.emit("data", this.handleExecutionPayload(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleExecutionPayload(
    block: eth.ExecutionPayload
  ): ExecutionPayload {
    const header = fromProtoExecutionHeader(block.getHeader()!);
    const transactions = block.getTransactionsList().map(fromProtoTx);

    return {
      header,
      transactions,
    };
  }
}

class BeaconBlockStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata) {
    super();
    this.retry(_client, _md);
  }

  async retry(_client: APIClient, _md: Metadata) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _blockStream = _client.subscribeBeaconBlocks(
      new google_protobuf_empty_pb.Empty(),
      _md
    );
    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: eth.CompactBeaconBlock) =>
      this.emit("data", this.handleBeaconBlock(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBeaconBlock(block: eth.CompactBeaconBlock): BeaconBlock {
    return fromProtoBeaconBlock(block);
  }
}

export { FilterBuilder };
