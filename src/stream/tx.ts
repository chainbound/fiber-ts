import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { bytesToHex, createAddressFromString } from "@ethereumjs/util";
import { Metadata } from "@grpc/grpc-js";
import { TransactionWithSender } from "../types.js";
import { TransactionWithSenderMsg, TxFilter } from "../../protobuf/api_pb.cjs";
import { common } from "../utils.js";
import { RLP } from "@ethereumjs/rlp";
import {
  BlobEIP4844NetworkValuesArray,
  TypedTransaction,
  createBlob4844TxFromBytesArray,
  createTxFromRLP,
} from "@ethereumjs/tx";

export class TxStream extends EventEmitter {
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
      let transaction: TypedTransaction;

      try {
        transaction = createTxFromRLP(data.getRlpTransaction_asU8(), { common });
      } catch (e: any) {
        // HOTFIX: Remove full blobs from the transaction which prevents deserialization
        // using `fromRLPTransaction`

        if (
          !e.message.includes(
            "Invalid EIP-4844 transaction. Only expecting 11 values (for unsigned tx) or 14 values (for signed tx)."
          )
        ) {
          console.error("Unexpected error while decoding RLP", e);
          return;
        }

        const networkTxValues = RLP.decode(data.getRlpTransaction_asU8().subarray(1));
        const [txValues, _blobs, _kzgCommitments, _kzgProofs] =
          networkTxValues as BlobEIP4844NetworkValuesArray;
        transaction = createBlob4844TxFromBytesArray(txValues, { common });
      }

      let res: TransactionWithSender = {
        sender: createAddressFromString(bytesToHex(data.getSender() as Uint8Array)),
        transaction,
      };

      this.emit("data", res);
    });

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md, _filter);
    });
  }
}
