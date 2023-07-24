"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBytes = exports.bytesToHex = exports.Client = exports.FilterBuilder = exports.from = exports.to = exports.and = exports.or = void 0;
const events_1 = require("events");
const ethers_1 = require("ethers");
const grpc_js_1 = require("@grpc/grpc-js");
const util_1 = require("@ethereumjs/util");
const tx_1 = require("@ethereumjs/tx");
const eth_pb_1 = __importDefault(require("../protobuf/eth_pb"));
const api_grpc_pb_1 = require("../protobuf/api_grpc_pb");
const api_pb_1 = require("../protobuf/api_pb");
var Operator;
(function (Operator) {
    Operator[Operator["AND"] = 1] = "AND";
    Operator[Operator["OR"] = 2] = "OR";
})(Operator || (Operator = {}));
function or(...ops) {
    return function (f, n) {
        let newNode = {
            Operator: Operator.OR,
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
        for (let op of ops) {
            op(f, newNode);
        }
    };
}
exports.or = or;
function and(...ops) {
    return function (f, n) {
        let newNode = {
            Operator: Operator.AND,
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
        for (let op of ops) {
            op(f, newNode);
        }
    };
}
exports.and = and;
function to(to) {
    return function (f, n) {
        let newNode = {
            Operand: {
                Key: "to",
                Value: hexToBase64(to),
            },
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
    };
}
exports.to = to;
function from(from) {
    return function (f, n) {
        let newNode = {
            Operand: {
                Key: "from",
                Value: hexToBase64(from),
            },
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
    };
}
exports.from = from;
class FilterBuilder {
    constructor(rootOp) {
        let f = {};
        rootOp(f, undefined);
        this._filter = f;
    }
    // public get or(): FilterBuilder {
    //   let newNode = {
    //     Operator: Operator.OR,
    //   };
    //   if (!this._filter.Root) {
    //     this._filter.Root = newNode;
    //   } else {
    //     if (this._next!.Nodes) {
    //       this._next!.Nodes.push(newNode);
    //     } else {
    //       this._next!.Nodes = new Array();
    //       this._next!.Nodes.push(newNode);
    //     }
    //   }
    //   this._last = this._next;
    //   this._next = newNode;
    //   return this;
    // }
    // public get and(): FilterBuilder {
    //   let newNode = {
    //     Operator: Operator.AND,
    //   };
    //   if (!this._filter.Root) {
    //     this._filter.Root = newNode;
    //   } else {
    //     if (this._next!.Nodes) {
    //       this._next!.Nodes.push(newNode);
    //     } else {
    //       this._next!.Nodes = new Array();
    //       this._next!.Nodes.push(newNode);
    //     }
    //   }
    //   this._last = this._next;
    //   this._next = newNode;
    //   return this;
    // }
    // public get exit(): FilterBuilder {
    //   this._next = this._last;
    //   return this;
    // }
    // public from(address: string): FilterBuilder {
    //   address = hexToBase64(address);
    //   let newNode = {
    //     Operand: {
    //       Key: 'from',
    //       Value: address,
    //     },
    //   };
    //   // If there's no root yet, set it here
    //   if (!this._filter.Root) {
    //     this._filter.Root = newNode;
    //     this._next = newNode;
    //   } else {
    //     // Else append as a child
    //     // If we get here, we can be sure that this._next is defined
    //     if (this._next!.Nodes) {
    //       this._next!.Nodes.push(newNode);
    //     } else {
    //       this._next!.Nodes = new Array();
    //       this._next!.Nodes.push(newNode);
    //     }
    //   }
    //   return this;
    // }
    // public to(address: string): FilterBuilder {
    //   address = hexToBase64(address);
    //   let newNode = {
    //     Operand: {
    //       Key: 'to',
    //       Value: address,
    //     },
    //   };
    //   // If there's no root yet, set it here
    //   if (!this._filter.Root) {
    //     this._filter.Root = newNode;
    //     this._next = newNode;
    //   } else {
    //     // Else append as a child
    //     // If we get here, we can be sure that this._next is defined
    //     if (this._next!.Nodes) {
    //       this._next!.Nodes.push(newNode);
    //     } else {
    //       this._next!.Nodes = new Array();
    //       this._next!.Nodes.push(newNode);
    //     }
    //   }
    //   return this;
    // }
    toString() {
        return JSON.stringify(this._filter, null, 2);
    }
    build() {
        return new Uint8Array(Buffer.from(JSON.stringify(this._filter)));
    }
}
exports.FilterBuilder = FilterBuilder;
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
            this._txStream.write(toProto(tx), this._md, (err) => {
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
        sequenceMsg.setSequenceList(txs.map(toProto));
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
        _txStream.on("data", (data) => this.emit("tx", fromProto(data)));
        _txStream.on("error", async (err) => {
            console.error(err);
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
            _client.waitForReady(deadline, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const _blockStream = _client.subscribeNewBlocks(new api_pb_1.BlockFilter(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("block", this.handleBlock(data)));
        _blockStream.on("error", async () => {
            this.retry(_client, _md);
        });
    }
    handleBlock(block) {
        const txList = [];
        for (let tx of block.getTransactionsList()) {
            txList.push(fromProto(tx));
        }
        return {
            hash: bytesToHex(block.getHash()),
            parentHash: bytesToHex(block.getParentHash()),
            number: block.getNumber(),
            timestamp: block.getTimestamp(),
            prevRandao: bytesToHex(block.getPrevRandao()),
            stateRoot: bytesToHex(block.getStateRoot()),
            receiptRoot: bytesToHex(block.getReceiptRoot()),
            feeRecipient: bytesToHex(block.getFeeRecipient()),
            extraData: bytesToHex(block.getExtraData()),
            gasLimit: ethers_1.ethers.BigNumber.from(block.getGasLimit()),
            gasUsed: ethers_1.ethers.BigNumber.from(block.getGasUsed()),
            logsBloom: bytesToHex(block.getLogsBloom()),
            baseFeePerGas: ethers_1.ethers.BigNumber.from(block.getBaseFeePerGas()),
            transactions: txList,
        };
    }
}
function fromProto(tx) {
    let value = 0n;
    if (tx.getValue()) {
        value = BigInt("0x" + Buffer.from(tx.getValue()).toString("hex"));
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
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString("hex")),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString("hex")),
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
    return "0x" + Buffer.from(b).toString("hex");
}
exports.bytesToHex = bytesToHex;
function hexToBytes(str) {
    if (!str) {
        return new Uint8Array();
    }
    if (str.substring(0, 2) !== "0x") {
        str = "0x" + str;
    }
    const a = [];
    for (let i = 2, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(a);
}
exports.hexToBytes = hexToBytes;
function hexToBase64(str) {
    if (str.substring(0, 2) == "0x") {
        str = str.slice(2);
    }
    return Buffer.from(str, "hex").toString("base64");
}
