import { APIClient } from '../protobuf/api_grpc_pb';
import { ClientDuplexStream, credentials, Metadata } from '@grpc/grpc-js';
import { BackrunMsg, BlockFilter, RawBackrunMsg, RawTxMsg, TxFilter, TransactionResponse as PbResponse } from '../protobuf/api_pb';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { FeeMarketEIP1559Transaction, Transaction, TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import eth from '../protobuf/eth_pb'
import { Address } from '@ethereumjs/util';

export interface TransactionResponse {
    hash: string;
    timestamp: number;
}

// Re-export
export { TxFilter };

export class Client {
    private _client: APIClient;
    private _md: Metadata;

    private _txStream: ClientDuplexStream<eth.Transaction, PbResponse>;
    private _rawTxStream: ClientDuplexStream<RawTxMsg, PbResponse>;
    private _backrunStream: ClientDuplexStream<BackrunMsg, PbResponse>;
    private _rawBackrunStream: ClientDuplexStream<RawBackrunMsg, PbResponse>;

    constructor(target: string, apiKey: string) {
        // this._client = new API;
        this._client = new APIClient(target, credentials.createInsecure());
        this._md = new Metadata();
        this._md.add('x-api-key', apiKey)

        this._txStream = this._client.sendTransactionStream(this._md);
        this._rawTxStream = this._client.sendRawTransactionStream(this._md);
        this._backrunStream = this._client.backrunStream(this._md);
        this._rawBackrunStream = this._client.rawBackrunStream(this._md);
    }

    waitForReady(seconds: number): Promise<void> {
        const now = new Date();
        const deadline = new Date(now.getTime() + seconds * 1000);

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
    subscribeNewTxs(filter?: TxFilter): TxStream {
        const f = filter ?? new TxFilter()
        return new TxStream(this._client, this._md, f);
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
                    this._txStream.on('data', (res: PbResponse) => {
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
     * @param rawtx a serialized RLP encoded signed transaction in hexadecimal
     * @returns response containing hash and timestamp
     */
    async sendRawTransaction(rawtx: string): Promise<TransactionResponse> {
        const rawMsg = new RawTxMsg();

        if (rawtx.substring(0, 2) === '0x') {
            rawtx = rawtx.substring(2);
        }

        rawMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, 'hex')));
        return new Promise((resolve, reject) => {
            this._rawTxStream.write(rawMsg, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    this._rawTxStream.on('data', (res: PbResponse) => {
                        resolve({
                            hash: res.getHash(),
                            timestamp: res.getTimestamp(),
                        });
                    });
                }
            })
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
            this._backrunStream.write(backrunMsg, this._md, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    this._backrunStream.on('data', (res: PbResponse) => {
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
     * @param hash hash of target transaction
     * @param rawtx a signed and serialized transaction
     * @returns response containing hash and timestamp
     */
    async rawBackrunTransaction(hash: string, rawtx: string): Promise<TransactionResponse> {
        const backrunMsg = new RawBackrunMsg();
        backrunMsg.setHash(hash);

        if (rawtx.substring(0, 2) === '0x') {
            rawtx = rawtx.substring(2);
        }

        backrunMsg.setRawtx(Uint8Array.from(Buffer.from(rawtx, 'hex')));
        return new Promise((resolve, reject) => {
            this._rawBackrunStream.write(backrunMsg, this._md, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    this._rawBackrunStream.on('data', (res: PbResponse) => {
                        resolve({
                            hash: res.getHash(),
                            timestamp: res.getTimestamp(),
                        });
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
            _client.waitForReady(deadline, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });

        });

        const _txStream = _client.subscribeNewTxs(_filter, _md);
        _txStream.on('close', () => this.emit('close'));
        _txStream.on('end', () => this.emit('end'));
        _txStream.on('data', (data: eth.Transaction) => this.emit('tx', fromProto(data)));

        _txStream.on('error', async () => {
            this.retry(_client, _md, _filter);
        });
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
    constructor(_client: APIClient, _md: Metadata) {
        super();
        this.retry(_client, _md);
    }

    async retry(_client: APIClient, _md: Metadata) {
        const now = new Date();
        const deadline = new Date(now.getTime() + 60 * 1000);
        await new Promise<void>((resolve, reject) => {
            _client.waitForReady(deadline, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });

        });

        const _blockStream = _client.subscribeNewBlocks(new BlockFilter(), _md);
        _blockStream.on('close', () => this.emit('close'));
        _blockStream.on('end', () => this.emit('end'));
        _blockStream.on('data', (data: eth.Block) => this.emit('block', this.handleBlock(data)));

        _blockStream.on('error', async () => {
            this.retry(_client, _md);
        });
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
        maxFeePerGas: BigInt(tx.getMaxFee()),
        maxPriorityFeePerGas: BigInt(tx.getPriorityFee()),
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString('hex')),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString('hex')),
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
            proto.setTo(newtx.to.buf)
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
    return '0x' + Buffer.from(b).toString('hex')
}

export function hexToBytes(str: string) {
    if (!str) {
        return new Uint8Array();
    }

    if (str.substring(0, 2) !== '0x') {
        str = '0x' + str
    }

    console.log(str)

    const a = [];
    for (let i = 2, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}