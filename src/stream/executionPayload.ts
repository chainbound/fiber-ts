import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb.js";
import { Metadata } from "@grpc/grpc-js";
import { TypedTransaction as TypedTransaction } from "@ethereumjs/tx";
import { Block, BlockHeader } from "@ethereumjs/block";
import { ssz, allForks } from "@lodestar/types";
import { Address, Withdrawal } from "@ethereumjs/util";
import { EventEmitter } from "events";

type BeaconBlock = allForks.BeaconBlock;

import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";

import type {
  ExecutionPayloadMsg,
  BeaconBlockMsg,
} from "../../protobuf/api_pb.cjs";

import { FilterBuilder } from "../filter.js";
import { fromRLPTransaction } from "../types.js";

export class ExecutionPayloadStream extends EventEmitter {
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
