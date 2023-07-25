/// <reference types="node" />
import { EventEmitter } from "events";
import { ethers } from "ethers";
import { Metadata } from "@grpc/grpc-js";
import { TypedTransaction } from "@ethereumjs/tx";
import { APIClient } from "../protobuf/api_grpc_pb";
import { TxFilter } from "../protobuf/api_pb";
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
declare enum Operator {
    AND = 1,
    OR = 2
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
export declare function or(...ops: FilterOp[]): FilterOp;
export declare function and(...ops: FilterOp[]): FilterOp;
export declare function to(to: string): FilterOp;
export declare function from(from: string): FilterOp;
export declare class FilterBuilder {
    private _filter;
    private _next;
    private _last;
    constructor(rootOp: FilterOp);
    toString(): string;
    build(): Uint8Array;
}
export declare class Client {
    private _client;
    private _md;
    private _txStream;
    private _rawTxStream;
    private _txSequenceStream;
    private _rawTxSequenceStream;
    constructor(target: string, apiKey: string);
    waitForReady(seconds: number): Promise<void>;
    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(filter?: FilterBuilder): TxStream;
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
     * @param rawtx an array of serialized RLP encoded signed transactions in hexadecimal
     * @returns response containing array of hashes and timestamps
     */
    sendRawTransaction(rawtx: string): Promise<TransactionResponse>;
    /**
     *
     * @param txs an array of signed! typed transactions
     * @returns response containing array of hashes and timestamps
     */
    sendTransactionSequence(txs: TypedTransaction[]): Promise<TransactionResponse[]>;
    /**
     * @param rawTxs an array of signed and serialized transactions
     * @returns response containing array of hashes and timestamps
     */
    sendRawTransactionSequence(rawTxs: string[]): Promise<TransactionResponse[]>;
}
declare class TxStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata, _filter: TxFilter);
    retry(_client: APIClient, _md: Metadata, _filter: TxFilter): Promise<void>;
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
declare class BlockStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleBlock;
}
export declare function bytesToHex(b: string | Uint8Array): string;
export declare function hexToBytes(str: string): Uint8Array;
export {};
