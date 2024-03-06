import { ClientDuplexStream, credentials, Metadata } from "@grpc/grpc-js";
import { TypedTransaction } from "@ethereumjs/tx";
import { default as Package } from "../package.json" with { type: "json" };

import type { APIClient } from "../protobuf/api_grpc_pb.cjs";
const ProtobufApiGrpcPb = await import("../protobuf/api_grpc_pb.cjs");

import type {
  TransactionResponse as PbResponse,
  TxSequenceResponse,
  TransactionMsg,
  TxSequenceMsgV2,
} from "../protobuf/api_pb.cjs";

const ProtobufApiPb = (await import("../protobuf/api_pb.cjs")).default;

import {
  TxStream,
  ExecutionPayloadStream,
  BeaconBlockStream,
  TxRawStream,
  BeaconBlockRawStream,
} from "./stream/index.js";
import { FilterBuilder } from "./filter.js";
import { TransactionResponse } from "./types.js";
import { BlobTxStream } from "./stream/blobTx.js";
import { BlobTxRawStream } from "./stream/blobTxRaw.js";

export class Client {
  private _client: APIClient;
  private _md: Metadata;

  private _txStream: ClientDuplexStream<TransactionMsg, PbResponse>;
  private _txSequenceStream: ClientDuplexStream<TxSequenceMsgV2, TxSequenceResponse>;

  constructor(target: string, apiKey: string) {
    this._client = new ProtobufApiGrpcPb.APIClient(target, credentials.createInsecure());
    this._md = new Metadata();
    this._md.add("x-api-key", apiKey);
    this._md.add("x-client-version", `${Package.name}/v${Package.version}`);

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
   * Subscribes to the new transactions stream.
   * @returns {TxStream} emits new txs with sender of type `TransactionWithSender` as events
   */
  subscribeNewTxs(filter?: FilterBuilder): TxStream {
    const f = filter ? filter.build() : new Uint8Array();

    const protoFilter = new ProtobufApiPb.TxFilter();
    protoFilter.setEncoded(f);
    return new TxStream(this._client, this._md, protoFilter);
  }

  /**
   * Subscribes to the new transactions stream.
   * @returns {TxRawStream} emits new raw txs with sender of type `TransactionRawWithSender` as events
   */
  subscribeNewRawTxs(filter?: FilterBuilder): TxRawStream {
    const f = filter ? filter.build() : new Uint8Array();

    const protoFilter = new ProtobufApiPb.TxFilter();
    protoFilter.setEncoded(f);
    return new TxRawStream(this._client, this._md, protoFilter);
  }

  /**
   * Subscribes to the new transactions stream.
   * @returns {TxStream} emits new txs with sender of type `BlobTransactionWithSender` as events
   */
  subscribeNewBlobTxs(): TxStream {
    return new BlobTxStream(this._client, this._md);
  }

  /**
   * Subscribes to the new transactions stream.
   * @returns {TxStream} emits new txs with sender of type `TransactionRawWithSender` as events
   *
   * Note: transactions are returned with the "raw format" `type || rlp([tx_payload_body, blobs,
   * commitments, proofs])` compatible with the `eth_sendRawTransaction` RPC
   */
  subscribeNewBlobRawTxs(): TxStream {
    return new BlobTxRawStream(this._client, this._md);
  }

  /**
   * Subscribes to the new execution payloads stream.
   * @returns {ExecutionPayloadStream} emits new blocks of type `Block` as events (with transactions)
   */
  subscribeNewExecutionPayloads(): ExecutionPayloadStream {
    return new ExecutionPayloadStream(this._client, this._md);
  }

  /**
   * Subscribes to the new beacon blocks stream.
   * @returns {BeaconBlockStream} emits new beacon blocks of type `BeaconBlock` as events
   */
  subscribeNewBeaconBlocks(): BeaconBlockStream {
    return new BeaconBlockStream(this._client, this._md);
  }

  /**
   * Subscribes to the new raw beacon blocks stream.
   * @returns {BeaconBlockRawStream} emits new raw ssz-encoded beacon blocks of type `Uint8Array` as events
   */
  subscribeNewRawBeaconBlocks(): BeaconBlockRawStream {
    return new BeaconBlockRawStream(this._client, this._md);
  }

  /**
   * sends a transaction
   * @param tx a signed! typed transaction
   * @returns response containing hash and timestamp
   */
  async sendTransaction(tx: TypedTransaction): Promise<TransactionResponse> {
    let message = new ProtobufApiPb.TransactionMsg();
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
    const rawMsg = new ProtobufApiPb.TransactionMsg();

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
  async sendTransactionSequence(txs: TypedTransaction[]): Promise<TransactionResponse[]> {
    const sequenceMsg = new ProtobufApiPb.TxSequenceMsgV2();
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
  async sendRawTransactionSequence(rawTxs: string[]): Promise<TransactionResponse[]> {
    const sequenceMsg = new ProtobufApiPb.TxSequenceMsgV2();

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
