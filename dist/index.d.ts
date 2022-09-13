/// <reference types="node" />
import { ClientReadableStream } from '@grpc/grpc-js';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { TypedTransaction } from '@ethereumjs/tx';
import eth from '../protobuf/eth_pb';
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
export declare class Client {
    private _client;
    private _md;
    constructor(target: string, apiKey: string);
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
    /**
     * sends a transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    sendTransaction(tx: TypedTransaction): Promise<TransactionResponse>;
    /**
     * sends a transaction
     * @param rawtx a serialized RLP encoded signed transaction in hexadecimal
     * @returns response containing hash and timestamp
     */
    sendRawTransaction(rawtx: string): Promise<TransactionResponse>;
    /**
     *
     * @param hash hash of target transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    backrunTransaction(hash: string, tx: TypedTransaction): Promise<TransactionResponse>;
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
    transactions: TypedTransaction[];
}
declare class BlockStream extends EventEmitter {
    private _txStream;
    constructor(txStream: ClientReadableStream<eth.Block>);
    private handleBlock;
}
export {};
