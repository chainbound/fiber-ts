import EventEmitter from "events";
import { Address, bytesToHex } from "@ethereumjs/util";
import EmptyPb from "google-protobuf/google/protobuf/empty_pb.js";
export class BlobTxRawStream extends EventEmitter {
    constructor(_client, _md) {
        super();
        this.retry(_client, _md);
    }
    async retry(_client, _md) {
        const now = new Date();
        const deadline = new Date(now.getTime() + 60 * 1000);
        await new Promise((resolve, reject) => {
            _client.waitForReady(deadline, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const _txStream = _client.subscribeNewBlobTxs(new EmptyPb.Empty(), _md);
        _txStream.on("close", () => this.emit("close"));
        _txStream.on("end", () => this.emit("end"));
        _txStream.on("data", (data) => {
            let res = {
                sender: Address.fromString(bytesToHex(data.getSender())),
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
