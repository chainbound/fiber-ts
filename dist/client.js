import { credentials, Metadata } from "@grpc/grpc-js";
import { default as Package } from "../package.json" with { type: "json" };
const ProtobufApiGrpcPb = await import("../protobuf/api_grpc_pb.cjs");
const ProtobufApiPb = (await import("../protobuf/api_pb.cjs")).default;
import { TxStream, ExecutionPayloadStream, BeaconBlockStream, TxRawStream, BeaconBlockRawStream, } from "./stream/index.js";
export class Client {
    _client;
    _md;
    _txStream;
    _txSequenceStream;
    constructor(target, apiKey) {
        this._client = new ProtobufApiGrpcPb.APIClient(target, credentials.createInsecure());
        this._md = new Metadata();
        this._md.add("x-api-key", apiKey);
        this._md.add("x-client-version", `${Package.name}/v${Package.version}`);
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
     * Subscribes to the new transactions stream.
     * @returns {TxStream} emits new txs with sender of type `TransactionWithSender` as events
     */
    subscribeNewTxs(filter) {
        const f = filter ? filter.build() : new Uint8Array();
        const protoFilter = new ProtobufApiPb.TxFilter();
        protoFilter.setEncoded(f);
        return new TxStream(this._client, this._md, protoFilter);
    }
    /**
     * Subscribes to the new transactions stream.
     * @returns {TxRawStream} emits new raw txs with sender of type `TransactionRawWithSender` as events
     */
    subscribeNewRawTxs(filter) {
        const f = filter ? filter.build() : new Uint8Array();
        const protoFilter = new ProtobufApiPb.TxFilter();
        protoFilter.setEncoded(f);
        return new TxRawStream(this._client, this._md, protoFilter);
    }
    /**
     * Subscribes to the new execution payloads stream.
     * @returns {ExecutionPayloadStream} emits new blocks of type `Block` as events (with transactions)
     */
    subscribeNewExecutionPayloads() {
        return new ExecutionPayloadStream(this._client, this._md);
    }
    /**
     * Subscribes to the new beacon blocks stream.
     * @returns {BeaconBlockStream} emits new beacon blocks of type `BeaconBlock` as events
     */
    subscribeNewBeaconBlocks() {
        return new BeaconBlockStream(this._client, this._md);
    }
    /**
     * Subscribes to the new raw beacon blocks stream.
     * @returns {BeaconBlockRawStream} emits new raw ssz-encoded beacon blocks of type `Uint8Array` as events
     */
    subscribeNewRawBeaconBlocks() {
        return new BeaconBlockRawStream(this._client, this._md);
    }
    /**
     * sends a transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    async sendTransaction(tx) {
        let message = new ProtobufApiPb.TransactionMsg();
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
        const rawMsg = new ProtobufApiPb.TransactionMsg();
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
        const sequenceMsg = new ProtobufApiPb.TxSequenceMsgV2();
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
        const sequenceMsg = new ProtobufApiPb.TxSequenceMsgV2();
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
