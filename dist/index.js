"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const api_grpc_pb_1 = require("../protobuf/api_grpc_pb");
const eth_pb_1 = __importDefault(require("../protobuf/eth_pb"));
const grpc_js_1 = require("@grpc/grpc-js");
const api_pb_1 = require("../protobuf/api_pb");
const events_1 = require("events");
const ethers_1 = require("ethers");
class Client {
    constructor(target) {
        // this._client = new API;
        this._client = new api_grpc_pb_1.APIClient(target, grpc_js_1.credentials.createInsecure());
    }
    waitForReady(seconds) {
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + seconds);
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
    subscribeNewTxs() {
        const stream = this._client.subscribeNewTxs(new api_pb_1.TxFilter());
        return new TxStream(stream);
    }
    /**
     * subscribes to the new blocks stream.
     * @returns {BlockStream} - emits new blocks as events
     */
    subscribeNewBlocks() {
        const stream = this._client.subscribeNewBlocks(new api_pb_1.BlockFilter());
        return new BlockStream(stream);
    }
    sendTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._client.sendTransaction(toProto(tx), (err, res) => {
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
        });
    }
    backrunTransaction(hash, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const backrunMsg = new api_pb_1.BackrunMsg();
            backrunMsg.setHash(hash);
            backrunMsg.setTx(toProto(tx));
            return new Promise((resolve, reject) => {
                this._client.backrun(backrunMsg, (err, res) => {
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
        });
    }
}
exports.Client = Client;
class TxStream extends events_1.EventEmitter {
    constructor(txStream) {
        super();
        this._txStream = txStream;
        this._txStream.on('close', () => this.emit('close'));
        this._txStream.on('end', () => this.emit('end'));
        this._txStream.on('data', (data) => this.emit('tx', fromProto(data)));
    }
}
class BlockStream extends events_1.EventEmitter {
    constructor(txStream) {
        super();
        this._txStream = txStream;
        this._txStream.on('close', () => this.emit('close'));
        this._txStream.on('end', () => this.emit('end'));
        this._txStream.on('data', (data) => this.emit('block', this.handleBlock(data)));
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
    const hex = '0x' + Buffer.from(tx.getValue()).toString('hex');
    let value = ethers_1.ethers.BigNumber.from(0);
    if (hex !== '0x') {
        value = ethers_1.ethers.BigNumber.from(hex);
    }
    return {
        hash: bytesToHex(tx.getHash()),
        from: bytesToHex(tx.getFrom()),
        to: bytesToHex(tx.getTo()),
        type: tx.getType(),
        nonce: tx.getNonce(),
        gasLimit: ethers_1.ethers.BigNumber.from(tx.getGas()),
        data: bytesToHex(tx.getInput()),
        chainId: tx.getChainid(),
        value: value,
        gasPrice: ethers_1.ethers.BigNumber.from(tx.getGasPrice()),
        maxFeePerGas: ethers_1.ethers.BigNumber.from(tx.getMaxFee()),
        maxPriorityFeePerGas: ethers_1.ethers.BigNumber.from(tx.getPriorityFee()),
        v: tx.getV(),
        r: bytesToHex(tx.getR()),
        s: bytesToHex(tx.getS()),
    };
}
function toProto(tx) {
    const proto = new eth_pb_1.default.Transaction();
    let gasPrice = 0;
    if (tx.gasPrice) {
        gasPrice = tx.gasPrice.toNumber();
    }
    let maxFee = 0;
    if (tx.maxFeePerGas) {
        maxFee = tx.maxFeePerGas.toNumber();
    }
    let priorityFee = 0;
    if (tx.maxPriorityFeePerGas) {
        priorityFee = tx.maxPriorityFeePerGas.toNumber();
    }
    proto.setHash(hexToBytes(tx.hash));
    proto.setFrom(hexToBytes(tx.from));
    proto.setTo(hexToBytes(tx.to));
    proto.setType(tx.type);
    proto.setNonce(tx.nonce);
    proto.setInput(hexToBytes(tx.data));
    proto.setChainid(tx.chainId);
    proto.setValue(hexToBytes(tx.value.toHexString()));
    proto.setGas(tx.gasLimit.toNumber());
    proto.setGasPrice(gasPrice);
    proto.setMaxFee(maxFee);
    proto.setPriorityFee(priorityFee);
    proto.setV(tx.v);
    proto.setR(hexToBytes(tx.r));
    proto.setS(hexToBytes(tx.s));
    return proto;
}
function bytesToHex(b) {
    return '0x' + Buffer.from(b).toString('hex');
}
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
