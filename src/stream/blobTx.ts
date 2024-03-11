import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Address, bytesToHex } from "@ethereumjs/util";
import { Metadata } from "@grpc/grpc-js";
import { BlobTransactionWithSender } from "../types.js";
import ApiPb from "../../protobuf/api_pb.cjs";
import { BlobEIP4844Transaction } from "@ethereumjs/tx";

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

    const _txStream = _client.subscribeNewBlobTxs(new ApiPb.TxFilter(), _md);
    _txStream.on("close", () => this.emit("close"));
    _txStream.on("end", () => this.emit("end"));
    _txStream.on("data", (data: ApiPb.TransactionWithSenderMsg) => {
      let res: BlobTransactionWithSender = {
        sender: Address.fromString(bytesToHex(data.getSender() as Uint8Array)),
        // Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)
        transaction: BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(
          data.getRlpTransaction_asU8()
        ),
      };

      this.emit("data", res);
    });

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md);
    });
  }
}
