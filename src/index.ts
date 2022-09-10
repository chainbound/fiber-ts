import { APIClient } from '../protobuf/api_grpc_pb';
import { ClientReadableStream, credentials } from '@grpc/grpc-js';
import { BackrunMsg, BlockFilter, TxFilter } from '../protobuf/api_pb';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { FeeMarketEIP1559Transaction, Transaction, TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import eth from '../protobuf/eth_pb'
import { Address } from '@ethereumjs/util';

export interface TransactionResponse {
    hash: string;
    timestamp: number;
}

export class Client {
    private _client: APIClient;

    constructor(target: string) {
        // this._client = new API;
        this._client = new APIClient(target, credentials.createInsecure());

    }

    waitForReady(seconds: number): Promise<void> {
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + seconds);

        return new Promise((resolve, reject) => {
            this._client.waitForReady(deadline, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(): TxStream {
        const stream = this._client.subscribeNewTxs(new TxFilter());
        return new TxStream(stream);
    }

    /**
     * subscribes to the new blocks stream.
     * @returns {BlockStream} - emits new blocks as events
     */
    subscribeNewBlocks(): BlockStream {
        const stream = this._client.subscribeNewBlocks(new BlockFilter());
        return new BlockStream(stream);
    }

    /**
     * sends a transaction 
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    async sendTransaction(tx: TypedTransaction): Promise<TransactionResponse> {
        return new Promise((resolve, reject) => {
            this._client.sendTransaction(toProto(tx), (err, res) => {
                if (err) {
                    reject(err);
                } else {
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
    async backrunTransaction(hash: string, tx: TypedTransaction): Promise<TransactionResponse> {
        const backrunMsg = new BackrunMsg();
        backrunMsg.setHash(hash);
        backrunMsg.setTx(toProto(tx));

        return new Promise((resolve, reject) => {
            this._client.backrun(backrunMsg, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        hash: res.getHash(),
                        timestamp: res.getTimestamp(),
                    });
                }
            });
        });
    }
}

class TxStream extends EventEmitter {
    private _txStream: ClientReadableStream<eth.Transaction>;

    constructor(txStream: ClientReadableStream<eth.Transaction>) {
        super();
        this._txStream = txStream;

        this._txStream.on('close', () => this.emit('close'));
        this._txStream.on('end', () => this.emit('end'));

        this._txStream.on('data', (data: eth.Transaction) => this.emit('tx', fromProto(data)));
    }
}

export interface Block {
    hash: string,
    parentHash: string,
    number: number,
    nonce: number,
    timestamp: number,
    difficulty: number,
    totalDifficulty: ethers.BigNumber,
    gasLimit: ethers.BigNumber,
    gasUsed: ethers.BigNumber,
    coinbase: string,
    extraData: string,
    transactions: TypedTransaction[],
}

class BlockStream extends EventEmitter {
    private _txStream: ClientReadableStream<eth.Block>;

    constructor(txStream: ClientReadableStream<eth.Block>) {
        super();
        this._txStream = txStream;

        this._txStream.on('close', () => this.emit('close'));
        this._txStream.on('end', () => this.emit('end'));

        this._txStream.on('data', (data: eth.Block) => this.emit('block', this.handleBlock(data)));
    }

    private handleBlock(block: eth.Block): Block {
        const header = block.getHeader()!;
        const body = block.getBody()!;

        const txList: TypedTransaction[] = [];

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
            totalDifficulty: ethers.BigNumber.from(header.getTotalDifficulty()),
            gasLimit: ethers.BigNumber.from(header.getGasLimit()),
            gasUsed: ethers.BigNumber.from(header.getGasUsed()),
            coinbase: bytesToHex(header.getCoinbase()),
            extraData: bytesToHex(header.getExtraData()),
            transactions: txList,
        }
    }
}

function fromProto(tx: eth.Transaction): TypedTransaction {
    let value = 0n
    if (tx.getValue()) {
        value = BigInt("0x" + Buffer.from(tx.getValue()).toString('hex'))
    }
    return TransactionFactory.fromTxData({
        // hash: tx.getHash(),
        // from: bytesToHex(tx.getFrom()),
        to: new Address(Buffer.from(tx.getTo())),
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
        s: BigInt("0x"+ Buffer.from(tx.getS()).toString('hex')),
    })
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
        proto.setValue(hexToBytes("0x" +tx.value.toString(16)));
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
            proto.setTo(newtx.to.buf)
        }

        proto.setType(tx.type);
        proto.setNonce(Number(tx.nonce));
        if (tx.data) {
            proto.setInput(newtx.data);
        }

        proto.setChainid(Number(newtx.chainId));
        proto.setValue(hexToBytes("0x" +newtx.value.toString(16)));
        proto.setGas(Number(newtx.gasLimit));
        proto.setMaxFee(Number(newtx.maxFeePerGas));
        proto.setPriorityFee(Number(newtx.maxPriorityFeePerGas));
        proto.setV(Number(tx.v!));
        proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
    }



    return proto;
}

function bytesToHex(b: string | Uint8Array): string {
    return '0x' + Buffer.from(b).toString('hex')
}

function hexToBytes(str: string) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 2, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}