import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Metadata } from "@grpc/grpc-js";
import { TransactionWithSenderMsg, TxFilter } from "../../protobuf/api_pb.cjs";
import { TransactionWithSender, fromRLPTransaction } from "../types.js";
import { Address } from "@ethereumjs/util";

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
