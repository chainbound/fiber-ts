import { default as google_protobuf_empty_pb } from "google-protobuf/google/protobuf/empty_pb.js";
import { common } from "../utils.js";
import { Withdrawal, bytesToHex, createAddressFromString } from "@ethereumjs/util";
import { Block, createBlockHeader } from "@ethereumjs/block";
import { EventEmitter } from "events";
import { ssz } from "@lodestar/types";
import { createTxFromRLP } from "@ethereumjs/tx";
export class ExecutionPayloadStream extends EventEmitter {
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
        const _blockStream = _client.subscribeExecutionPayloadsV2(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleExecutionPayload(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleExecutionPayload(block) {
        const version = block.getDataVersion();
        const sszEncodedBeaconBlock = block.getSszPayload_asU8();
        let header;
        let withdrawals;
        let transactions;
        switch (version) {
            case 3: {
                // BELLATRIX DATA VERSION
                const decoded = ssz.bellatrix.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = createBlockHeader({
                    parentHash: decoded.parentHash,
                    coinbase: decoded.feeRecipient,
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    baseFeePerGas: decoded.baseFeePerGas,
                });
                transactions = decoded.transactions.map((tx) => createTxFromRLP(tx, { common }));
                break;
            }
            case 4: {
                // CAPELLA DATA VERSION
                const decoded = ssz.capella.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = createBlockHeader({
                    parentHash: decoded.parentHash,
                    coinbase: decoded.feeRecipient,
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined,
                });
                transactions = decoded.transactions.map((tx) => createTxFromRLP(tx, { common }));
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), createAddressFromString(bytesToHex(w.address)), w.amount);
                    return t;
                });
                break;
            }
            case 5: {
                // DENEB DATA VERSION
                const decoded = ssz.deneb.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = createBlockHeader({
                    parentHash: decoded.parentHash,
                    coinbase: decoded.feeRecipient,
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined,
                    blobGasUsed: BigInt(decoded.blobGasUsed),
                    excessBlobGas: BigInt(decoded.excessBlobGas),
                    parentBeaconBlockRoot: undefined,
                });
                transactions = decoded.transactions.map((tx) => createTxFromRLP(tx, { common }));
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), createAddressFromString(bytesToHex(w.address)), w.amount);
                    return t;
                });
                break;
            }
            default: {
                // just try using capella if the version doesn't match
                const decoded = ssz.capella.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = createBlockHeader({
                    parentHash: decoded.parentHash,
                    coinbase: decoded.feeRecipient,
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined,
                });
                transactions = decoded.transactions.map((tx) => createTxFromRLP(tx, { common }));
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), createAddressFromString(bytesToHex(w.address)), w.amount);
                    return t;
                });
                break;
            }
        }
        return new Block(header, transactions, undefined, withdrawals);
    }
}
