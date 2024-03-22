import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Address, bytesToHex } from "@ethereumjs/util";
import { Metadata } from "@grpc/grpc-js";
import { BlobTransactionWithSender } from "../types.js";
import ApiPb from "../../protobuf/api_pb.cjs";
import { BlobEIP4844NetworkValuesArray, BlobEIP4844Transaction } from "@ethereumjs/tx";
import EmptyPb from "google-protobuf/google/protobuf/empty_pb.js";
import { RLP } from "@ethereumjs/rlp";
import { common } from "../utils.js";

export class BlobTxStream extends EventEmitter {
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

    const _txStream = _client.subscribeNewBlobTxs(new EmptyPb.Empty(), _md);
    _txStream.on("close", () => this.emit("close"));
    _txStream.on("end", () => this.emit("end"));
    _txStream.on("data", (data: ApiPb.TransactionWithSenderMsg) => {
      const networkTxValues = RLP.decode(
        data.getRlpTransaction_asU8().subarray(1)
      ) as BlobEIP4844NetworkValuesArray;
      const [txValues, blobs, kzgCommitments, kzgProofs] = networkTxValues;

      const transactionWithoutBlobs = BlobEIP4844Transaction.fromValuesArray(txValues, {
        common,
      });

      const transactionWithBlobs = new BlobEIP4844Transaction(
        {
          ...transactionWithoutBlobs,
          blobs,
          kzgCommitments,
          kzgProofs,
        },
        { common }
      );

      let res: BlobTransactionWithSender = {
        sender: Address.fromString(bytesToHex(data.getSender() as Uint8Array)),
        transaction: transactionWithBlobs,
      };

      this.emit("data", res);
    });

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md);
    });
  }
}
