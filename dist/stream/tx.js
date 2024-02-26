import EventEmitter from "events";
import { Address, bytesToHex } from "@ethereumjs/util";
import { fromRLPTransaction } from "../utils.js";
export class TxStream extends EventEmitter {
    constructor(_client, _md, _filter) {
        super();
        this.retry(_client, _md, _filter);
    }
    async retry(_client, _md, _filter) {
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
        const _txStream = _client.subscribeNewTxsV2(_filter, _md);
        _txStream.on("close", () => this.emit("close"));
        _txStream.on("end", () => this.emit("end"));
        _txStream.on("data", (data) => {
            let res = {
                sender: Address.fromString(bytesToHex(data.getSender())),
                transaction: fromRLPTransaction(data.getRlpTransaction_asU8()),
            };
            this.emit("data", res);
        });
        _txStream.on("error", async (err) => {
            console.error(err);
            this.retry(_client, _md, _filter);
        });
    }
}
