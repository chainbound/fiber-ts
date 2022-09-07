/// <reference types="node" />
import eth from '../protobuf/eth_pb';
import { ClientReadableStream } from '@grpc/grpc-js';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
export declare class Client {
    private _client;
    constructor(target: string);
    waitForReady(seconds: number): Promise<void>;
    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(): TxStream;
    /**
     * subscribes to the new blocks stream.
     * @returns {BlockStream} - emits new blocks as events
     */
    subscribeNewBlocks(): BlockStream;
    sendTransaction(tx: ethers.Transaction): Promise<TransactionResponse>;
    backrunTransaction(hash: string, tx: ethers.Transaction): Promise<TransactionResponse>;
}
declare class TxStream extends EventEmitter {
    private _txStream;
    constructor(txStream: ClientReadableStream<eth.Transaction>);
}
export interface Block {
    hash: string;
    parentHash: string;
    number: number;
    nonce: number;
    timestamp: number;
    difficulty: number;
    totalDifficulty: ethers.BigNumber;
    gasLimit: ethers.BigNumber;
    gasUsed: ethers.BigNumber;
    coinbase: string;
    extraData: string;
    transactions: ethers.Transaction[];
}
declare class BlockStream extends EventEmitter {
    private _txStream;
    constructor(txStream: ClientReadableStream<eth.Block>);
    private handleBlock;
}
export {};
