import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { credentials, Metadata } from "@grpc/grpc-js";
import { Address, Withdrawal } from "@ethereumjs/util";
import { Block, BlockHeader } from "@ethereumjs/block";
import { ssz } from "@lodestar/types";
import { EventEmitter } from "events";
import { APIClient } from "../protobuf/api_grpc_pb";
import { TxFilter, TransactionMsg, TxSequenceMsgV2, } from "../protobuf/api_pb";
import { FilterBuilder } from "./filter";
import { fromRLPTransaction, } from "./types";
export class Client {
    constructor(target, apiKey) {
        this._client = new APIClient(target, credentials.createInsecure());
        this._md = new Metadata();
        this._md.add("x-api-key", apiKey);
        this._txStream = this._client.sendTransactionV2(this._md);
        this._txSequenceStream = this._client.sendTransactionSequenceV2(this._md);
    }
    waitForReady(seconds) {
        const now = new Date();
        const deadline = new Date(now.getTime() + seconds * 1000);
        return new Promise((resolve, reject) => {
            this._client.waitForReady(deadline, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(filter) {
        const f = filter ? filter.build() : new Uint8Array();
        const protoFilter = new TxFilter();
        protoFilter.setEncoded(f);
        return new TxStream(this._client, this._md, protoFilter);
    }
    /**
     * subscribes to the new execution payloads stream.
     * @returns {ExecutionPayloadStream} - emits new blocks as events (with transactions)
     */
    subscribeNewExecutionPayloads() {
        return new ExecutionPayloadStream(this._client, this._md);
    }
    /**
     * subscribes to the new beacon blocks stream.
     * @returns {BeaconBlockStream} - emits new beacon blocks as events
     */
    subscribeNewBeaconBlocks() {
        return new BeaconBlockStream(this._client, this._md);
    }
    /**
     * sends a transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    async sendTransaction(tx) {
        let message = new TransactionMsg();
        message.setRlpTransaction(tx.serialize());
        return new Promise((resolve, reject) => {
            this._txStream.write(message, this._md, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._txStream.on("data", (res) => {
                        resolve({
                            hash: res.getHash(),
                            timestamp: res.getTimestamp(),
                        });
                    });
                }
            });
        });
    }
    /**
     * sends a transaction
     * @param rawtx an array of serialized RLP encoded signed transactions in hexadecimal
     * @returns response containing array of hashes and timestamps
     */
    async sendRawTransaction(rawtx) {
        const rawMsg = new TransactionMsg();
        if (rawtx.substring(0, 2) === "0x") {
            rawtx = rawtx.substring(2);
        }
        rawMsg.setRlpTransaction(Uint8Array.from(Buffer.from(rawtx, "hex")));
        return new Promise((resolve, reject) => {
            this._txStream.write(rawMsg, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._txStream.on("data", (res) => {
                        resolve({
                            hash: res.getHash(),
                            timestamp: res.getTimestamp(),
                        });
                    });
                }
            });
        });
    }
    /**
     *
     * @param txs an array of signed! typed transactions
     * @returns response containing array of hashes and timestamps
     */
    async sendTransactionSequence(txs) {
        const sequenceMsg = new TxSequenceMsgV2();
        sequenceMsg.setSequenceList(txs.map((tx) => tx.serialize()));
        return new Promise((resolve, reject) => {
            this._txSequenceStream.write(sequenceMsg, this._md, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._txSequenceStream.on("data", (res) => {
                        let response = [];
                        for (let r of res.getSequenceResponseList()) {
                            response.push({
                                hash: r.getHash(),
                                timestamp: r.getTimestamp(),
                            });
                        }
                        resolve(response);
                    });
                }
            });
        });
    }
    /**
     * @param rawTxs an array of signed and serialized transactions
     * @returns response containing array of hashes and timestamps
     */
    async sendRawTransactionSequence(rawTxs) {
        const sequenceMsg = new TxSequenceMsgV2();
        // remove 0x prefix if present
        for (const [idx, rawtx] of rawTxs.entries()) {
            if (rawtx.substring(0, 2) === "0x") {
                rawTxs[idx] = rawtx.substring(2);
            }
        }
        sequenceMsg.setSequenceList(rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex"))));
        return new Promise((resolve, reject) => {
            this._txSequenceStream.write(sequenceMsg, this._md, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._txSequenceStream.on("data", (res) => {
                        let response = [];
                        for (let r of res.getSequenceResponseList()) {
                            response.push({
                                hash: r.getHash(),
                                timestamp: r.getTimestamp(),
                            });
                        }
                        resolve(response);
                    });
                }
            });
        });
    }
}
class TxStream extends EventEmitter {
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
                sender: Address.fromString(data.getSender()),
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
class ExecutionPayloadStream extends EventEmitter {
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
        const sszEncodedBeaconBlock = block.getSszPayload();
        let header;
        let withdrawals;
        let transactions;
        switch (version) {
            case 3: {
                // BELLATRIX DATA VERSION
                const decoded = ssz.allForksExecution.bellatrix.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = BlockHeader.fromHeaderData({
                    parentHash: decoded.parentHash,
                    uncleHash: Uint8Array.from([]),
                    coinbase: Address.fromPublicKey(decoded.feeRecipient),
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    difficulty: undefined,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    nonce: undefined,
                    baseFeePerGas: decoded.baseFeePerGas,
                });
                transactions = decoded.transactions.map(fromRLPTransaction);
                break;
            }
            case 4: {
                // CAPELLA DATA VERSION
                const decoded = ssz.allForksExecution.capella.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = BlockHeader.fromHeaderData({
                    parentHash: decoded.parentHash,
                    uncleHash: Uint8Array.from([]),
                    coinbase: Address.fromPublicKey(decoded.feeRecipient),
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    difficulty: undefined,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    nonce: undefined,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined, // TODO: document that this will be always null
                });
                transactions = decoded.transactions.map(fromRLPTransaction);
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), Address.fromPublicKey(w.address), w.amount);
                    return t;
                });
                break;
            }
            case 5: {
                // DENEB DATA VERSION
                const decoded = ssz.allForksExecution.deneb.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = BlockHeader.fromHeaderData({
                    parentHash: decoded.parentHash,
                    uncleHash: Uint8Array.from([]),
                    coinbase: Address.fromPublicKey(decoded.feeRecipient),
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    difficulty: undefined,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    nonce: undefined,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined,
                    blobGasUsed: BigInt(decoded.blobGasUsed),
                    excessBlobGas: BigInt(decoded.excessBlobGas),
                    parentBeaconBlockRoot: undefined, // TODO: document that this will be always empty
                });
                transactions = decoded.transactions.map(fromRLPTransaction);
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), Address.fromPublicKey(w.address), w.amount);
                    return t;
                });
                break;
            }
            default: {
                // just try using capella if the version doesn't match
                const decoded = ssz.allForksExecution.capella.ExecutionPayload.deserialize(sszEncodedBeaconBlock);
                header = BlockHeader.fromHeaderData({
                    parentHash: decoded.parentHash,
                    uncleHash: Uint8Array.from([]),
                    coinbase: Address.fromPublicKey(decoded.feeRecipient),
                    stateRoot: decoded.stateRoot,
                    transactionsTrie: undefined,
                    receiptTrie: decoded.receiptsRoot,
                    logsBloom: decoded.logsBloom,
                    difficulty: undefined,
                    number: BigInt(decoded.blockNumber),
                    gasLimit: BigInt(decoded.gasLimit),
                    gasUsed: BigInt(decoded.gasUsed),
                    timestamp: BigInt(decoded.timestamp),
                    extraData: decoded.extraData,
                    mixHash: decoded.prevRandao,
                    nonce: undefined,
                    baseFeePerGas: decoded.baseFeePerGas,
                    withdrawalsRoot: undefined, // TODO: document that this will be always null
                });
                transactions = decoded.transactions.map(fromRLPTransaction);
                withdrawals = decoded.withdrawals.map((w) => {
                    let t = new Withdrawal(BigInt(w.index), BigInt(w.validatorIndex), Address.fromPublicKey(w.address), w.amount);
                    return t;
                });
                break;
            }
        }
        return new Block(header, transactions, undefined, withdrawals);
    }
}
class BeaconBlockStream extends EventEmitter {
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
        const _blockStream = _client.subscribeBeaconBlocksV2(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleBeaconBlock(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleBeaconBlock(block) {
        const version = block.getDataVersion();
        const sszEncodedBeaconBlock = block.getSszBlock();
        switch (version) {
            case 3: {
                return this.decodeBellatrix(sszEncodedBeaconBlock);
            }
            case 4: {
                return this.decodeCapella(sszEncodedBeaconBlock);
            }
            case 5: {
                return this.decodeDeneb(sszEncodedBeaconBlock);
            }
            default: {
                return this.decodeCapella(sszEncodedBeaconBlock);
            }
        }
    }
    decodeBellatrix(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
    decodeCapella(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.capella.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
    decodeDeneb(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.deneb.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
}
export { FilterBuilder };
//# sourceMappingURL=index.js.map