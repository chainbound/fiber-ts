import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb.js";
import { ClientDuplexStream, credentials, Metadata } from "@grpc/grpc-js";
import { TypedTransaction as TypedTransaction } from "@ethereumjs/tx";
import { Block, BlockHeader } from "@ethereumjs/block";
import { ssz, allForks } from "@lodestar/types";
import { Address, Withdrawal } from "@ethereumjs/util";
import { EventEmitter } from "events";

type BeaconBlock = allForks.BeaconBlock;

import type { APIClient } from "../protobuf/api_grpc_pb.cjs";
const ProtoBufApiGrpcPb = await import("../protobuf/api_grpc_pb.cjs");

import type {
  TransactionResponse as PbResponse,
  TxSequenceResponse,
  TxFilter,
  TransactionMsg,
  TxSequenceMsgV2,
  TransactionWithSenderMsg,
  ExecutionPayloadMsg,
  BeaconBlockMsg,
} from "../protobuf/api_pb.cjs";

const ProtobufApiPb = (await import("../protobuf/api_pb.cjs")).default;

import { FilterBuilder } from "./filter.js";
import {
  fromRLPTransaction,
  TransactionResponse,
  TransactionWithSender,
} from "./types.js";

export class Client {
  private _client: APIClient;
  private _md: Metadata;

  private _txStream: ClientDuplexStream<TransactionMsg, PbResponse>;
  private _txSequenceStream: ClientDuplexStream<
    TxSequenceMsgV2,
    TxSequenceResponse
  >;

  constructor(target: string, apiKey: string) {
    this._client = new ProtoBufApiGrpcPb.APIClient(
      target,
      credentials.createInsecure(),
    );
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

    const protoFilter = new ProtobufApiPb.TxFilter();
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
  async sendTransactionSequence(
    txs: TypedTransaction[],
  ): Promise<TransactionResponse[]> {
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
  async sendRawTransactionSequence(
    rawTxs: string[],
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new ProtobufApiPb.TxSequenceMsgV2();

    // remove 0x prefix if present
    for (const [idx, rawtx] of rawTxs.entries()) {
      if (rawtx.substring(0, 2) === "0x") {
        rawTxs[idx] = rawtx.substring(2);
      }
    }

    sequenceMsg.setSequenceList(
      rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex"))),
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
      _md,
    );

    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: ExecutionPayloadMsg) =>
      this.emit("data", this.handleExecutionPayload(data)),
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleExecutionPayload(block: ExecutionPayloadMsg): Block {
    const version = block.getDataVersion();
    const sszEncodedBeaconBlock = block.getSszPayload() as Uint8Array;

    let header: BlockHeader | undefined;
    let withdrawals: Withdrawal[] | undefined;
    let transactions: TypedTransaction[] | undefined;

    switch (version) {
      case 3: {
        // BELLATRIX DATA VERSION
        const decoded =
          ssz.allForksExecution.bellatrix.ExecutionPayload.deserialize(
            sszEncodedBeaconBlock,
          );
        header = BlockHeader.fromHeaderData({
          parentHash: decoded.parentHash,
          uncleHash: Uint8Array.from([]),
          coinbase: Address.fromPublicKey(decoded.feeRecipient), // TODO: double check this
          stateRoot: decoded.stateRoot,
          transactionsTrie: undefined, // TODO: document that this will be always empty
          receiptTrie: decoded.receiptsRoot,
          logsBloom: decoded.logsBloom,
          difficulty: undefined, // TODO: put the actual terminal merge difficulty here
          number: BigInt(decoded.blockNumber),
          gasLimit: BigInt(decoded.gasLimit),
          gasUsed: BigInt(decoded.gasUsed),
          timestamp: BigInt(decoded.timestamp),
          extraData: decoded.extraData,
          mixHash: decoded.prevRandao,
          nonce: undefined, // TODO: document that this will be always empty (post merge)
          baseFeePerGas: decoded.baseFeePerGas,
        });
        transactions = decoded.transactions.map(fromRLPTransaction);
        break;
      }
      case 4: {
        // CAPELLA DATA VERSION
        const decoded =
          ssz.allForksExecution.capella.ExecutionPayload.deserialize(
            sszEncodedBeaconBlock,
          );
        header = BlockHeader.fromHeaderData({
          parentHash: decoded.parentHash,
          uncleHash: Uint8Array.from([]),
          coinbase: Address.fromPublicKey(decoded.feeRecipient), // TODO: double check this
          stateRoot: decoded.stateRoot,
          transactionsTrie: undefined, // TODO: document that this will be always empty
          receiptTrie: decoded.receiptsRoot,
          logsBloom: decoded.logsBloom,
          difficulty: undefined, // TODO: put the actual terminal merge difficulty here
          number: BigInt(decoded.blockNumber),
          gasLimit: BigInt(decoded.gasLimit),
          gasUsed: BigInt(decoded.gasUsed),
          timestamp: BigInt(decoded.timestamp),
          extraData: decoded.extraData,
          mixHash: decoded.prevRandao,
          nonce: undefined, // TODO: document that this will be always empty (post merge)
          baseFeePerGas: decoded.baseFeePerGas,
          withdrawalsRoot: undefined, // TODO: document that this will be always null
        });
        transactions = decoded.transactions.map(fromRLPTransaction);
        withdrawals = decoded.withdrawals.map((w) => {
          let t = new Withdrawal(
            BigInt(w.index),
            BigInt(w.validatorIndex),
            Address.fromPublicKey(w.address),
            w.amount,
          );
          return t;
        });
        break;
      }
      case 5: {
        // DENEB DATA VERSION
        const decoded =
          ssz.allForksExecution.deneb.ExecutionPayload.deserialize(
            sszEncodedBeaconBlock,
          );
        header = BlockHeader.fromHeaderData({
          parentHash: decoded.parentHash,
          uncleHash: Uint8Array.from([]),
          coinbase: Address.fromPublicKey(decoded.feeRecipient), // TODO: double check this
          stateRoot: decoded.stateRoot,
          transactionsTrie: undefined, // TODO: document that this will be always empty
          receiptTrie: decoded.receiptsRoot,
          logsBloom: decoded.logsBloom,
          difficulty: undefined, // TODO: put the actual terminal merge difficulty here
          number: BigInt(decoded.blockNumber),
          gasLimit: BigInt(decoded.gasLimit),
          gasUsed: BigInt(decoded.gasUsed),
          timestamp: BigInt(decoded.timestamp),
          extraData: decoded.extraData,
          mixHash: decoded.prevRandao,
          nonce: undefined, // TODO: document that this will be always empty (post merge)
          baseFeePerGas: decoded.baseFeePerGas,
          withdrawalsRoot: undefined, // TODO: document that this will be always null
          blobGasUsed: BigInt(decoded.blobGasUsed),
          excessBlobGas: BigInt(decoded.excessBlobGas),
          parentBeaconBlockRoot: undefined, // TODO: document that this will be always empty
        });
        transactions = decoded.transactions.map(fromRLPTransaction);
        withdrawals = decoded.withdrawals.map((w) => {
          let t = new Withdrawal(
            BigInt(w.index),
            BigInt(w.validatorIndex),
            Address.fromPublicKey(w.address),
            w.amount,
          );
          return t;
        });
        break;
      }
      default: {
        // just try using capella if the version doesn't match
        const decoded =
          ssz.allForksExecution.capella.ExecutionPayload.deserialize(
            sszEncodedBeaconBlock,
          );
        header = BlockHeader.fromHeaderData({
          parentHash: decoded.parentHash,
          uncleHash: Uint8Array.from([]),
          coinbase: Address.fromPublicKey(decoded.feeRecipient), // TODO: double check this
          stateRoot: decoded.stateRoot,
          transactionsTrie: undefined, // TODO: document that this will be always empty
          receiptTrie: decoded.receiptsRoot,
          logsBloom: decoded.logsBloom,
          difficulty: undefined, // TODO: put the actual terminal merge difficulty here
          number: BigInt(decoded.blockNumber),
          gasLimit: BigInt(decoded.gasLimit),
          gasUsed: BigInt(decoded.gasUsed),
          timestamp: BigInt(decoded.timestamp),
          extraData: decoded.extraData,
          mixHash: decoded.prevRandao,
          nonce: undefined, // TODO: document that this will be always empty (post merge)
          baseFeePerGas: decoded.baseFeePerGas,
          withdrawalsRoot: undefined, // TODO: document that this will be always null
        });
        transactions = decoded.transactions.map(fromRLPTransaction);
        withdrawals = decoded.withdrawals.map((w) => {
          let t = new Withdrawal(
            BigInt(w.index),
            BigInt(w.validatorIndex),
            Address.fromPublicKey(w.address),
            w.amount,
          );
          return t;
        });
        break;
      }
    }

    return new Block(header, transactions, undefined, withdrawals);
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
      _md,
    );
    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: BeaconBlockMsg) =>
      this.emit("data", this.handleBeaconBlock(data)),
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBeaconBlock(block: BeaconBlockMsg): BeaconBlock {
    const version = block.getDataVersion();

    const sszEncodedBeaconBlock = block.getSszBlock() as Uint8Array;
    switch (version) {
      case 3: {
        return this.decodeBellatrix(sszEncodedBeaconBlock);
      }
      case 4: {
        return this.decodeCapella(sszEncodedBeaconBlock);
      }
      case 5: {
        return this.decodeDeneb(sszEncodedBeaconBlock);
      }
      default: {
        return this.decodeCapella(sszEncodedBeaconBlock);
      }
    }
  }

  private decodeBellatrix(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded = ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(
      sszEncodedBeaconBlock,
    );
    return decoded.message;
  }

  private decodeCapella(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded = ssz.allForks.capella.SignedBeaconBlock.deserialize(
      sszEncodedBeaconBlock,
    );
    return decoded.message;
  }

  private decodeDeneb(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded = ssz.allForks.deneb.SignedBeaconBlock.deserialize(
      sszEncodedBeaconBlock,
    );
    return decoded.message;
  }
}

export { FilterBuilder };
