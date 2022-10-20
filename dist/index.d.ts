/// <reference types="node" />
import { APIClient } from '../protobuf/api_grpc_pb';
import { Metadata } from '@grpc/grpc-js';
import { TxFilter } from '../protobuf/api_pb';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import { TypedTransaction } from '@ethereumjs/tx';
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
export { TxFilter };
export declare class Client {
    private _client;
    private _md;
    private _rawTxStream;
    constructor(target: string, apiKey: string);
    waitForReady(seconds: number): Promise<void>;
    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(filter?: TxFilter): TxStream;
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
    sendRawTransaction2(rawtx: string): Promise<TransactionResponse>;
    /**
     *
     * @param hash hash of target transaction
     * @param tx a signed! typed transaction
     * @returns response containing hash and timestamp
     */
    backrunTransaction(hash: string, tx: TypedTransaction): Promise<TransactionResponse>;
    /**
     * @param hash hash of target transaction
     * @param rawtx a signed and serialized transaction
     * @returns response containing hash and timestamp
     */
    rawBackrunTransaction(hash: string, rawtx: string): Promise<TransactionResponse>;
}
declare class TxStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata, _filter: TxFilter);
    retry(_client: APIClient, _md: Metadata, _filter: TxFilter): Promise<void>;
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
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleBlock;
}
export declare function bytesToHex(b: string | Uint8Array): string;
export declare function hexToBytes(str: string): Uint8Array;
