import { EventEmitter } from "events";
import { ethers } from "ethers";

import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { ClientDuplexStream, credentials, Metadata } from "@grpc/grpc-js";
import { Address } from "@ethereumjs/util";
import {
  FeeMarketEIP1559Transaction,
  Transaction,
  TransactionFactory,
  TypedTransaction,
} from "@ethereumjs/tx";

import eth from "../protobuf/eth_pb";
import { APIClient } from "../protobuf/api_grpc_pb";
import {
  RawTxMsg,
  TransactionResponse as PbResponse,
  TxSequenceMsg,
  TxSequenceResponse,
  RawTxSequenceMsg,
  TxFilter,
} from "../protobuf/api_pb";

export interface TransactionResponse {
  hash: string;
  timestamp: number;
}

enum Operator {
  AND = 1,
  OR = 2,
}

interface FilterKV {
  Key: string;
  Value: string;
}

interface Node {
  Operand?: FilterKV;
  Operator?: Operator;
  Nodes?: Array<Node>;
}

interface Filter {
  Root: Node;
}

type FilterOp = (f: Filter, n?: Node) => void;

export function or(...ops: FilterOp[]): FilterOp {
  return function (f, n) {
    let newNode = {
      Operator: Operator.OR,
    };
    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }

    for (let op of ops) {
      op(f, newNode);
    }
  };
}

export function and(...ops: FilterOp[]): FilterOp {
  return function (f, n) {
    let newNode = {
      Operator: Operator.AND,
    };
    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }

    for (let op of ops) {
      op(f, newNode);
    }
  };
}

export function to(to: string): FilterOp {
  return function (f, n) {
    let newNode = {
      Operand: {
        Key: "to",
        Value: hexToBase64(to),
      },
    };

    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }
  };
}

export function from(from: string): FilterOp {
  return function (f, n) {
    let newNode = {
      Operand: {
        Key: "from",
        Value: hexToBase64(from),
      },
    };

    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }
  };
}

export class FilterBuilder {
  private _filter: Filter;
  private _next: Node | undefined;
  private _last: Node | undefined;

  public constructor(rootOp: FilterOp) {
    let f = {} as Filter;

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

  public toString(): string {
    return JSON.stringify(this._filter, null, 2);
  }

  build(): Uint8Array {
    return new Uint8Array(Buffer.from(JSON.stringify(this._filter)));
  }
}

export class Client {
  private _client: APIClient;
  private _md: Metadata;

  private _txStream: ClientDuplexStream<eth.Transaction, PbResponse>;
  private _rawTxStream: ClientDuplexStream<RawTxMsg, PbResponse>;
  private _txSequenceStream: ClientDuplexStream<
    TxSequenceMsg,
    TxSequenceResponse
  >;
  private _rawTxSequenceStream: ClientDuplexStream<
    RawTxSequenceMsg,
    TxSequenceResponse
  >;

  constructor(target: string, apiKey: string) {
    this._client = new APIClient(target, credentials.createInsecure());
    this._md = new Metadata();
    this._md.add("x-api-key", apiKey);

    this._txStream = this._client.sendTransaction(this._md);
    this._rawTxStream = this._client.sendRawTransaction(this._md);
    this._txSequenceStream = this._client.sendTransactionSequence(this._md);
    this._rawTxSequenceStream = this._client.sendRawTransactionSequence(
      this._md
    );
  }

  waitForReady(seconds: number): Promise<void> {
    const now = new Date();
    const deadline = new Date(now.getTime() + seconds * 1000);

    return new Promise((resolve, reject) => {
      this._client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * subscribes to the new transactions stream.
   * @returns {TxStream} - emits new txs as events
   */
  subscribeNewTxs(filter?: FilterBuilder): TxStream {
    const f = filter ? filter.build() : new Uint8Array();

    const protoFilter = new TxFilter();
    protoFilter.setEncoded(f);
    return new TxStream(this._client, this._md, protoFilter);
  }

  /**
   * subscribes to the new blocks stream.
   * @returns {BlockStream} - emits new blocks as events
   */
  subscribeNewBlocks(): BlockStream {
    return new BlockStream(this._client, this._md);
  }

  /**
   * sends a transaction
   * @param tx a signed! typed transaction
   * @returns response containing hash and timestamp
   */
  async sendTransaction(tx: TypedTransaction): Promise<TransactionResponse> {
    return new Promise((resolve, reject) => {
      this._txStream.write(toProto(tx), this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._txStream.on("data", (res: PbResponse) => {
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
  async sendRawTransaction(rawtx: string): Promise<TransactionResponse> {
    const rawMsg = new RawTxMsg();

    if (rawtx.substring(0, 2) === "0x") {
      rawtx = rawtx.substring(2);
    }

    rawMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, "hex")));
    return new Promise((resolve, reject) => {
      this._rawTxStream.write(rawMsg, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._rawTxStream.on("data", (res: PbResponse) => {
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
  async sendTransactionSequence(
    txs: TypedTransaction[]
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new TxSequenceMsg();
    sequenceMsg.setSequenceList(txs.map(toProto));

    return new Promise((resolve, reject) => {
      this._txSequenceStream.write(sequenceMsg, this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._txSequenceStream.on("data", (res: TxSequenceResponse) => {
            let response: TransactionResponse[] = [];
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
  async sendRawTransactionSequence(
    rawTxs: string[]
  ): Promise<TransactionResponse[]> {
    const sequenceMsg = new RawTxSequenceMsg();

    // remove 0x prefix if present
    for (const [idx, rawtx] of rawTxs.entries()) {
      if (rawtx.substring(0, 2) === "0x") {
        rawTxs[idx] = rawtx.substring(2);
      }
    }

    sequenceMsg.setRawTxsList(
      rawTxs.map((rawtx) => Uint8Array.from(Buffer.from(rawtx, "hex")))
    );

    return new Promise((resolve, reject) => {
      this._rawTxSequenceStream.write(sequenceMsg, this._md, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          this._rawTxSequenceStream.on("data", (res: TxSequenceResponse) => {
            let response: TransactionResponse[] = [];
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
  constructor(_client: APIClient, _md: Metadata, _filter: TxFilter) {
    super();
    this.retry(_client, _md, _filter);
  }

  async retry(_client: APIClient, _md: Metadata, _filter: TxFilter) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _txStream = _client.subscribeNewTxs(_filter, _md);
    _txStream.on("close", () => this.emit("close"));
    _txStream.on("end", () => this.emit("end"));
    _txStream.on("data", (data: eth.Transaction) =>
      this.emit("tx", fromProto(data))
    );

    _txStream.on("error", async (err) => {
      console.error(err);
      this.retry(_client, _md, _filter);
    });
  }

  onData(cb: (tx: TypedTransaction) => void) {
    this.on("tx", cb);
  }
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  prevRandao: string;
  stateRoot: string;
  receiptRoot: string;
  feeRecipient: string;
  extraData: string;
  gasLimit: ethers.BigNumber;
  gasUsed: ethers.BigNumber;
  timestamp: number;
  logsBloom: string;
  baseFeePerGas: ethers.BigNumber;
  transactions: TypedTransaction[];
}

class BlockStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata) {
    super();
    this.retry(_client, _md);
  }

  async retry(_client: APIClient, _md: Metadata) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _blockStream = _client.subscribeNewBlocks(
      new google_protobuf_empty_pb.Empty(),
      _md
    );
    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: eth.Block) =>
      this.emit("block", this.handleBlock(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBlock(block: eth.Block): Block {
    const txList: TypedTransaction[] = [];

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
      gasLimit: ethers.BigNumber.from(block.getGasLimit()),
      gasUsed: ethers.BigNumber.from(block.getGasUsed()),
      logsBloom: bytesToHex(block.getLogsBloom()),
      baseFeePerGas: ethers.BigNumber.from(block.getBaseFeePerGas()),
      transactions: txList,
    };
  }

  onData(cb: (block: Block) => void) {
    this.on("block", cb);
  }
}

function fromProto(tx: eth.Transaction): TypedTransaction {
  let value = 0n;
  if (tx.getValue()) {
    value = BigInt("0x" + Buffer.from(tx.getValue()).toString("hex"));
  }

  let to;
  if (tx.getTo().length !== 0) {
    to = new Address(Buffer.from(tx.getTo()));
  } else {
    to = Address.zero();
  }

  return TransactionFactory.fromTxData({
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
function toProto(tx: TypedTransaction): eth.Transaction {
  const proto = new eth.Transaction();

  if (tx.type == 0) {
    const legacy = tx as Transaction;
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
    proto.setV(Number(tx.v!));
    proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
    proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
  } else {
    const newtx = tx as FeeMarketEIP1559Transaction;
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
    proto.setV(Number(tx.v!));
    proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
    proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
  }

  return proto;
}

export function bytesToHex(b: string | Uint8Array): string {
  return "0x" + Buffer.from(b).toString("hex");
}

export function hexToBytes(str: string) {
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

function hexToBase64(str: string) {
  if (str.substring(0, 2) == "0x") {
    str = str.slice(2);
  }

  return Buffer.from(str, "hex").toString("base64");
}
