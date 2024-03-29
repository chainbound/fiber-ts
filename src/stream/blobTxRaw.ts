import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Address, bytesToHex } from "@ethereumjs/util";
import { Metadata } from "@grpc/grpc-js";
import { TransactionRawWithSender } from "../types.js";
import ApiPb from "../../protobuf/api_pb.cjs";
import EmptyPb from "google-protobuf/google/protobuf/empty_pb.js";

export class BlobTxRawStream extends EventEmitter {
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
      let res: TransactionRawWithSender = {
        sender: Address.fromString(bytesToHex(data.getSender() as Uint8Array)),
        transaction: data.getRlpTransaction_asU8(),
      };

      this.emit("data", res);
    });

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md);
    });
  }
}
