import EventEmitter from "events";
import { Address, bytesToHex } from "@ethereumjs/util";
import { TxFilter } from "../../protobuf/api_pb.cjs";
import { BlobEIP4844Transaction } from "@ethereumjs/tx";
export class BlobTxStream extends EventEmitter {
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
        const _txStream = _client.subscribeNewBlobTxs(new TxFilter(), _md);
        _txStream.on("close", () => this.emit("close"));
        _txStream.on("end", () => this.emit("end"));
        _txStream.on("data", (data) => {
            let res = {
                sender: Address.fromString(bytesToHex(data.getSender())),
                // Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)
                transaction: BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(data.getRlpTransaction_asU8()),
            };
            this.emit("data", res);
        });
        _txStream.on("error", async (err) => {
            console.error(err);
            this.retry(_client, _md);
        });
    }
}
