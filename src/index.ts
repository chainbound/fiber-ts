import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { ClientDuplexStream, credentials, Metadata } from "@grpc/grpc-js";
import { TypedTransaction } from "@ethereumjs/tx";
import { Address } from "@ethereumjs/util";
import { bellatrix, ssz } from "@chainsafe/lodestar-types";
import { EventEmitter } from "events";

import { APIClient } from "../protobuf/api_grpc_pb";
import {
  TransactionResponse as PbResponse,
  TxSequenceResponse,
  TxFilter,
  TransactionMsg,
  TxSequenceMsgV2,
  TransactionWithSenderMsg,
  ExecutionPayloadMsg,
  BeaconBlockMsg,
} from "../protobuf/api_pb";
import { FilterBuilder } from "./filter";
import {
  ExecutionPayload,
  fromRLPTransaction,
  TransactionResponse,
  TransactionWithSender,
} from "./types";

export class Client {
  private _client: APIClient;
  private _md: Metadata;

  private _txStream: ClientDuplexStream<TransactionMsg, PbResponse>;
  private _txSequenceStream: ClientDuplexStream<
    TxSequenceMsgV2,
    TxSequenceResponse
  >;

  constructor(target: string, apiKey: string) {
    this._client = new APIClient(target, credentials.createInsecure());
    this._md = new Metadata();
    this._md.add("x-api-key", apiKey);

    this._txStream = this._client.sendTransactionV2(this._md);
    this._txSequenceStream = this._client.sendTransactionSequenceV2(this._md);
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
    let message = new TransactionMsg();
    message.setRlpTransaction(tx.serialize());

    return new Promise((resolve, reject) => {
      this._txStream.write(message, this._md, (err: Error) => {
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
    const rawMsg = new TransactionMsg();

    if (rawtx.substring(0, 2) === "0x") {
      rawtx = rawtx.substring(2);
    }

    rawMsg.setRlpTransaction(Uint8Array.from(Buffer.from(rawtx, "hex")));
    return new Promise((resolve, reject) => {
      this._txStream.write(rawMsg, (err: Error) => {
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
   *
   * @param txs an array of signed! typed transactions
   * @returns response containing array of hashes and timestamps
   */
  async sendTransactionSequence(
    txs: TypedTransaction[]
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new TxSequenceMsgV2();
    sequenceMsg.setSequenceList(txs.map((tx) => tx.serialize()));

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
    const sequenceMsg = new TxSequenceMsgV2();

    // remove 0x prefix if present
    for (const [idx, rawtx] of rawTxs.entries()) {
      if (rawtx.substring(0, 2) === "0x") {
        rawTxs[idx] = rawtx.substring(2);
      }
    }

    sequenceMsg.setSequenceList(
      rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex")))
    );

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

    const _txStream = _client.subscribeNewTxsV2(_filter, _md);
    _txStream.on("close", () => this.emit("close"));
    _txStream.on("end", () => this.emit("end"));
    _txStream.on("data", (data: TransactionWithSenderMsg) => {
      let res: TransactionWithSender = {
        sender: Address.fromString(data.getSender() as string),
        transaction: fromRLPTransaction(data.getRlpTransaction()),
      };

      this.emit("data", res);
    });

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md, _filter);
    });
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

    const _blockStream = _client.subscribeExecutionPayloadsV2(
      new google_protobuf_empty_pb.Empty(),
      _md
    );

    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: ExecutionPayloadMsg) =>
      this.emit("data", this.handleExecutionPayload(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleExecutionPayload(block: ExecutionPayloadMsg): ExecutionPayload {
    const version = block.getDataVersion();

    // TODO: decode block based on hardfork version
    const sszEncodedBeaconBlock = block.getSszPayload() as Uint8Array;
    const decoded = ssz.bellatrix.ExecutionPayload.deserialize(
      sszEncodedBeaconBlock
    );

    const header: bellatrix.ExecutionPayloadHeader = {
      ...decoded,
      transactionsRoot: Uint8Array.from([]),
    };

    const transactions: TypedTransaction[] =
      decoded.transactions.map(fromRLPTransaction);

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

    const _blockStream = _client.subscribeBeaconBlocksV2(
      new google_protobuf_empty_pb.Empty(),
      _md
    );
    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: BeaconBlockMsg) =>
      this.emit("data", this.handleBeaconBlock(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBeaconBlock(block: BeaconBlockMsg): bellatrix.BeaconBlock {
    const version = block.getDataVersion();

    // TODO: decode based on hardfork version
    const sszEncodedBeaconBlock = block.getSszBlock() as Uint8Array;
    const decoded = ssz.bellatrix.SignedBeaconBlock.deserialize(
      sszEncodedBeaconBlock
    );

    return decoded.message;
  }
}

export { FilterBuilder };
