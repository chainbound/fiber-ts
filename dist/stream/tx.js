import EventEmitter from "events";
import { Address, bytesToHex } from "@ethereumjs/util";
import { common, fromRLPTransaction } from "../utils.js";
import { RLP } from "@ethereumjs/rlp";
import { BlobEIP4844Transaction, } from "@ethereumjs/tx";
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
            let transaction;
            try {
                transaction = fromRLPTransaction(data.getRlpTransaction_asU8());
            }
            catch (e) {
                // HOTFIX: Remove full blobs from the transaction which prevents deserialization
                // using `fromRLPTransaction`
                if (!e.message.includes("Invalid EIP-4844 transaction. Only expecting 11 values (for unsigned tx) or 14 values (for signed tx).")) {
                    console.error("Unexpected error while decoding RLP", e);
                    return;
                }
                const networkTxValues = RLP.decode(data.getRlpTransaction_asU8().subarray(1));
                const [txValues, _blobs, _kzgCommitments, _kzgProofs] = networkTxValues;
                transaction = BlobEIP4844Transaction.fromValuesArray(txValues, { common });
            }
            let res = {
                sender: Address.fromString(bytesToHex(data.getSender())),
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
