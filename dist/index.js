"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const events_1 = require("events");
const google_protobuf_empty_pb = __importStar(require("google-protobuf/google/protobuf/empty_pb"));
const grpc_js_1 = require("@grpc/grpc-js");
const api_grpc_pb_1 = require("../protobuf/api_grpc_pb");
const api_pb_1 = require("../protobuf/api_pb");
const types_1 = require("./types");
class Client {
    constructor(target, apiKey) {
        this._client = new api_grpc_pb_1.APIClient(target, grpc_js_1.credentials.createInsecure());
        this._md = new grpc_js_1.Metadata();
        this._md.add("x-api-key", apiKey);
        this._txStream = this._client.sendTransaction(this._md);
        this._rawTxStream = this._client.sendRawTransaction(this._md);
        this._txSequenceStream = this._client.sendTransactionSequence(this._md);
        this._rawTxSequenceStream = this._client.sendRawTransactionSequence(this._md);
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
        const protoFilter = new api_pb_1.TxFilter();
        protoFilter.setEncoded(f);
        return new TxStream(this._client, this._md, protoFilter);
    }
    /**
     * subscribes to the new execution headers stream.
     * @returns {ExecutionHeaderStream} - emits new blocks as events (without transactions)
     */
    subscribeNewExecutionHeaders() {
        return new ExecutionHeaderStream(this._client, this._md);
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
        return new Promise((resolve, reject) => {
            this._txStream.write((0, types_1.toProtoTx)(tx), this._md, (err) => {
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
        const rawMsg = new api_pb_1.RawTxMsg();
        if (rawtx.substring(0, 2) === "0x") {
            rawtx = rawtx.substring(2);
        }
        rawMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, "hex")));
        return new Promise((resolve, reject) => {
            this._rawTxStream.write(rawMsg, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._rawTxStream.on("data", (res) => {
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
        const sequenceMsg = new api_pb_1.TxSequenceMsg();
        sequenceMsg.setSequenceList(txs.map(types_1.toProtoTx));
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
        const sequenceMsg = new api_pb_1.RawTxSequenceMsg();
        // remove 0x prefix if present
        for (const [idx, rawtx] of rawTxs.entries()) {
            if (rawtx.substring(0, 2) === "0x") {
                rawTxs[idx] = rawtx.substring(2);
            }
        }
        sequenceMsg.setRawTxsList(rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex"))));
        return new Promise((resolve, reject) => {
            this._rawTxSequenceStream.write(sequenceMsg, this._md, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    this._rawTxSequenceStream.on("data", (res) => {
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
exports.Client = Client;
class TxStream extends events_1.EventEmitter {
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
        const _txStream = _client.subscribeNewTxs(_filter, _md);
        _txStream.on("close", () => this.emit("close"));
        _txStream.on("end", () => this.emit("end"));
        _txStream.on("data", (data) => this.emit("data", (0, types_1.fromProtoTx)(data)));
        _txStream.on("error", async (err) => {
            console.error(err);
            this.retry(_client, _md, _filter);
        });
    }
}
class ExecutionHeaderStream extends events_1.EventEmitter {
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
        const _blockStream = _client.subscribeExecutionHeaders(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleExecutionPayloadHeader(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleExecutionPayloadHeader(block) {
        return (0, types_1.fromProtoExecutionHeader)(block);
    }
}
class ExecutionPayloadStream extends events_1.EventEmitter {
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
        const _blockStream = _client.subscribeExecutionPayloads(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleExecutionPayload(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleExecutionPayload(block) {
        const header = (0, types_1.fromProtoExecutionHeader)(block.getHeader());
        const transactions = block.getTransactionsList().map(types_1.fromProtoTx);
        return {
            header,
            transactions,
        };
    }
}
class BeaconBlockStream extends events_1.EventEmitter {
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
        const _blockStream = _client.subscribeBeaconBlocks(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleBeaconBlock(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleBeaconBlock(block) {
        return (0, types_1.fromProtoBeaconBlock)(block);
    }
}
