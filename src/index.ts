import { APIClient } from '../protobuf/api_grpc_pb';
import eth from '../protobuf/eth_pb'
import { ClientReadableStream, credentials } from '@grpc/grpc-js';
import { BackrunMsg, BlockFilter, TxFilter } from '../protobuf/api_pb';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { ExecutionPayload } from '../protobuf/types_pb';

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

    async sendTransaction(tx: ethers.Transaction): Promise<TransactionResponse> {
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

    async backrunTransaction(hash: string, tx: ethers.Transaction): Promise<TransactionResponse> {
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
    transactions: ethers.Transaction[],
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

        const txList: ethers.Transaction[] = [];

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

function fromProto(tx: eth.Transaction): ethers.Transaction {
    const hex = '0x' + Buffer.from(tx.getValue()).toString('hex')
    let value = ethers.BigNumber.from(0)
    if (hex !== '0x') {
        value = ethers.BigNumber.from(hex)
    }

    return {
        hash: bytesToHex(tx.getHash()),
        from: bytesToHex(tx.getFrom()),
        to: bytesToHex(tx.getTo()),
        type: tx.getType(),
        nonce: tx.getNonce(),
        gasLimit: ethers.BigNumber.from(tx.getGas()),
        data: bytesToHex(tx.getInput()),
        chainId: tx.getChainid(),
        value: value,
        gasPrice: ethers.BigNumber.from(tx.getGasPrice()),
        maxFeePerGas: ethers.BigNumber.from(tx.getMaxFee()),
        maxPriorityFeePerGas: ethers.BigNumber.from(tx.getPriorityFee()),
        v: tx.getV(),
        r: bytesToHex(tx.getR()),
        s: bytesToHex(tx.getS()),
    }
}

function toProto(tx: ethers.Transaction): eth.Transaction {
    const proto = new eth.Transaction();

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

    proto.setHash(hexToBytes(tx.hash!));
    proto.setFrom(hexToBytes(tx.from!));
    proto.setTo(hexToBytes(tx.to!));
    proto.setType(tx.type!);
    proto.setNonce(tx.nonce);
    proto.setInput(hexToBytes(tx.data));
    proto.setChainid(tx.chainId);
    proto.setValue(hexToBytes(tx.value.toHexString()));
    proto.setGas(tx.gasLimit.toNumber());
    proto.setGasPrice(gasPrice);
    proto.setMaxFee(maxFee);
    proto.setPriorityFee(priorityFee);
    proto.setV(tx.v!);
    proto.setR(hexToBytes(tx.r!));
    proto.setS(hexToBytes(tx.s!));

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


async function main() {
    // const client = new Client("fiber-node.fly.dev:8080")
    const client = new Client("localhost:8080")
    console.log('connecting')
    await client.waitForReady(10);
    console.log('ready')

    const sub = client.subscribeNewTxs()

    sub.once('tx', async (tx: ethers.Transaction) => {
        let newtx = fromProto(toProto(tx));
        if (newtx.chainId != 1) {
            return
        }

        console.log("https://etherscan.io/tx/" + newtx.hash);

        const wallet = new ethers.Wallet('15bb7dd02dd8805338310f045ae9975aedb7c90285618bd2ecdc91db52170a90')

        const nonce = 3;

        let signed = await wallet.signTransaction({
            chainId: 1,
            type: 2,
            to: '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493',
            gasLimit: 21000,
            value: 0,
            nonce: nonce,
            maxFeePerGas: newtx.maxFeePerGas,
            maxPriorityFeePerGas: newtx.maxPriorityFeePerGas,
            gasPrice: newtx.gasPrice,
        });

        if (newtx.type != 2) {
            signed = await wallet.signTransaction({
                chainId: 1,
                type: 0,
                to: '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493',
                gasLimit: 21000,
                value: 0,
                nonce: nonce,
                gasPrice: newtx.gasPrice,
            });
        }


        const parsed = ethers.utils.parseTransaction(signed);

        try {
            const res = await client.backrunTransaction(newtx.hash!, parsed);
            // const res = await client.sendTransaction(parsed);
            console.log("https://etherscan.io/tx/" + res.hash);
        } catch (err) {
            console.error(err)
        }
    })
}

main().then().catch(console.error)
