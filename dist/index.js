"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBytes = exports.bytesToHex = exports.Client = void 0;
const api_grpc_pb_1 = require("../protobuf/api_grpc_pb");
const grpc_js_1 = require("@grpc/grpc-js");
const api_pb_1 = require("../protobuf/api_pb");
const events_1 = require("events");
const ethers_1 = require("ethers");
const tx_1 = require("@ethereumjs/tx");
const eth_pb_1 = __importDefault(require("../protobuf/eth_pb"));
const util_1 = require("@ethereumjs/util");
class Client {
    constructor(target, apiKey) {
        // this._client = new API;
        this._client = new api_grpc_pb_1.APIClient(target, grpc_js_1.credentials.createInsecure());
        this._md = new grpc_js_1.Metadata();
        this._md.add('x-api-key', apiKey);
    }
    waitForReady(seconds) {
        const now = new Date();
        const deadline = new Date(now.getTime() + seconds * 1000);
        return new Promise((resolve, reject) => {
            this._client.waitForReady(deadline, err => {
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
        return new TxStream(this._client, this._md, filter);
    }
    /**
     * subscribes to the new blocks stream.
     * @returns {BlockStream} - emits new blocks as events
     */
    subscribeNewBlocks() {
        return new BlockStream(this._client, this._md);
    }
    /**
     * sends a transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    async sendTransaction(tx) {
        return new Promise((resolve, reject) => {
            this._client.sendTransaction(toProto(tx), this._md, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        hash: res.getHash(),
                        timestamp: res.getTimestamp(),
                    });
                }
            });
        });
    }
    /**
     * sends a transaction
     * @param rawtx a serialized RLP encoded signed transaction in hexadecimal
     * @returns response containing hash and timestamp
     */
    async sendRawTransaction(rawtx) {
        const rawMsg = new api_pb_1.RawTxMsg();
        if (rawtx.substring(0, 2) === '0x') {
            rawtx = rawtx.substring(2);
        }
        rawMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, 'hex')));
        return new Promise((resolve, reject) => {
            this._client.sendRawTransaction(rawMsg, this._md, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        hash: res.getHash(),
                        timestamp: res.getTimestamp(),
                    });
                }
            });
        });
    }
    /**
     *
     * @param hash hash of target transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    async backrunTransaction(hash, tx) {
        const backrunMsg = new api_pb_1.BackrunMsg();
        backrunMsg.setHash(hash);
        backrunMsg.setTx(toProto(tx));
        return new Promise((resolve, reject) => {
            this._client.backrun(backrunMsg, this._md, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        hash: res.getHash(),
                        timestamp: res.getTimestamp(),
                    });
                }
            });
        });
    }
    /**
     * @param hash hash of target transaction
     * @param rawtx a signed and serialized transaction
     * @returns response containing hash and timestamp
     */
    async rawBackrunTransaction(hash, rawtx) {
        const backrunMsg = new api_pb_1.RawBackrunMsg();
        backrunMsg.setHash(hash);
        if (rawtx.substring(0, 2) === '0x') {
            rawtx = rawtx.substring(2);
        }
        backrunMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, 'hex')));
        return new Promise((resolve, reject) => {
            this._client.rawBackrun(backrunMsg, this._md, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        hash: res.getHash(),
                        timestamp: res.getTimestamp(),
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
            _client.waitForReady(deadline, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const _txStream = _client.subscribeNewTxs(_filter, _md);
        _txStream.on('close', () => this.emit('close'));
        _txStream.on('end', () => this.emit('end'));
        _txStream.on('data', (data) => this.emit('tx', fromProto(data)));
        _txStream.on('error', async () => {
            this.retry(_client, _md, _filter);
        });
    }
}
class BlockStream extends events_1.EventEmitter {
    constructor(_client, _md) {
        super();
        this.retry(_client, _md);
    }
    async retry(_client, _md) {
        const now = new Date();
        const deadline = new Date(now.getTime() + 60 * 1000);
        await new Promise((resolve, reject) => {
            _client.waitForReady(deadline, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const _blockStream = _client.subscribeNewBlocks(new api_pb_1.BlockFilter(), _md);
        _blockStream.on('close', () => this.emit('close'));
        _blockStream.on('end', () => this.emit('end'));
        _blockStream.on('data', (data) => this.emit('block', this.handleBlock(data)));
        _blockStream.on('error', async () => {
            this.retry(_client, _md);
        });
    }
    handleBlock(block) {
        const header = block.getHeader();
        const body = block.getBody();
        const txList = [];
        for (let tx of body.getTransactionsList()) {
            txList.push(fromProto(tx));
        }
        return {
            hash: bytesToHex(header.getHash()),
            parentHash: bytesToHex(header.getParentHash()),
            number: header.getNumber(),
            timestamp: header.getTimestamp(),
            nonce: header.getNonce(),
            difficulty: header.getDifficulty(),
            totalDifficulty: ethers_1.ethers.BigNumber.from(header.getTotalDifficulty()),
            gasLimit: ethers_1.ethers.BigNumber.from(header.getGasLimit()),
            gasUsed: ethers_1.ethers.BigNumber.from(header.getGasUsed()),
            coinbase: bytesToHex(header.getCoinbase()),
            extraData: bytesToHex(header.getExtraData()),
            transactions: txList,
        };
    }
}
function fromProto(tx) {
    let value = 0n;
    if (tx.getValue()) {
        value = BigInt("0x" + Buffer.from(tx.getValue()).toString('hex'));
    }
    let to;
    if (tx.getTo().length !== 0) {
        to = new util_1.Address(Buffer.from(tx.getTo()));
    }
    else {
        to = util_1.Address.zero();
    }
    return tx_1.TransactionFactory.fromTxData({
        // hash: tx.getHash(),
        // from: bytesToHex(tx.getFrom()),
        to: to,
        type: tx.getType(),
        nonce: BigInt(tx.getNonce()),
        gasLimit: BigInt(tx.getGas()),
        data: Buffer.from(tx.getInput()),
        chainId: BigInt(tx.getChainid()),
        value: value,
        gasPrice: BigInt(tx.getGasPrice()),
        maxFeePerGas: BigInt(tx.getMaxFee()),
        maxPriorityFeePerGas: BigInt(tx.getPriorityFee()),
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString('hex')),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString('hex')),
    });
}
// WARNING: if transaction is legacy, it will only work on Ethereum mainnet.
function toProto(tx) {
    const proto = new eth_pb_1.default.Transaction();
    if (tx.type == 0) {
        const legacy = tx;
        proto.setHash(legacy.hash());
        proto.setFrom(legacy.getSenderAddress().buf);
        if (legacy.to) {
            proto.setTo(legacy.to.buf);
        }
        proto.setType(tx.type);
        proto.setNonce(Number(tx.nonce));
        if (tx.data) {
            proto.setInput(tx.data);
        }
        proto.setChainid(1);
        proto.setValue(hexToBytes("0x" + tx.value.toString(16)));
        proto.setGas(Number(tx.gasLimit));
        proto.setGasPrice(Number(legacy.gasPrice));
        proto.setV(Number(tx.v));
        proto.setR(hexToBytes("0x" + tx.r.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s.toString(16)));
    }
    else {
        const newtx = tx;
        proto.setHash(newtx.hash());
        proto.setFrom(newtx.getSenderAddress().buf);
        if (newtx.to) {
            proto.setTo(newtx.to.buf);
        }
        proto.setType(tx.type);
        proto.setNonce(Number(tx.nonce));
        if (tx.data) {
            proto.setInput(newtx.data);
        }
        proto.setChainid(Number(newtx.chainId));
        proto.setValue(hexToBytes("0x" + newtx.value.toString(16)));
        proto.setGas(Number(newtx.gasLimit));
        proto.setMaxFee(Number(newtx.maxFeePerGas));
        proto.setPriorityFee(Number(newtx.maxPriorityFeePerGas));
        proto.setV(Number(tx.v));
        proto.setR(hexToBytes("0x" + tx.r.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s.toString(16)));
    }
    return proto;
}
function bytesToHex(b) {
    return '0x' + Buffer.from(b).toString('hex');
}
exports.bytesToHex = bytesToHex;
function hexToBytes(str) {
    if (!str) {
        return new Uint8Array();
    }
    var a = [];
    for (var i = 2, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(a);
}
exports.hexToBytes = hexToBytes;
