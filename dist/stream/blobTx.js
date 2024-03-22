import EventEmitter from "events";
import { Address, bytesToHex } from "@ethereumjs/util";
import { BlobEIP4844Transaction } from "@ethereumjs/tx";
import EmptyPb from "google-protobuf/google/protobuf/empty_pb.js";
import { RLP } from "@ethereumjs/rlp";
import { common } from "../utils.js";
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
        const _txStream = _client.subscribeNewBlobTxs(new EmptyPb.Empty(), _md);
        _txStream.on("close", () => this.emit("close"));
        _txStream.on("end", () => this.emit("end"));
        _txStream.on("data", (data) => {
            const networkTxValues = RLP.decode(data.getRlpTransaction_asU8().subarray(1));
            const [txValues, blobs, kzgCommitments, kzgProofs] = networkTxValues;
            const transactionWithoutBlobs = BlobEIP4844Transaction.fromValuesArray(txValues, {
                common,
            });
            const transactionWithBlobs = new BlobEIP4844Transaction({
                ...transactionWithoutBlobs,
                blobs,
                kzgCommitments,
                kzgProofs,
            }, { common });
            let res = {
                sender: Address.fromString(bytesToHex(data.getSender())),
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
