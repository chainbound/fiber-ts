/// <reference types="node" resolution-mode="require"/>
import { Metadata } from "@grpc/grpc-js";
import { TypedTransaction as TypedTransaction } from "@ethereumjs/tx";
import { EventEmitter } from "events";
import type { APIClient } from "../protobuf/api_grpc_pb.cjs";
import type { TxFilter } from "../protobuf/api_pb.cjs";
import { FilterBuilder } from "./filter.js";
import { TransactionResponse } from "./types.js";
export declare class Client {
    private _client;
    private _md;
    private _txStream;
    private _txSequenceStream;
    constructor(target: string, apiKey: string);
    waitForReady(seconds: number): Promise<void>;
    /**
     * subscribes to the new transactions stream.
     * @returns {TxStream} - emits new txs as events
     */
    subscribeNewTxs(filter?: FilterBuilder): TxStream;
    /**
     * subscribes to the new execution payloads stream.
     * @returns {ExecutionPayloadStream} - emits new blocks as events (with transactions)
     */
    subscribeNewExecutionPayloads(): ExecutionPayloadStream;
    /**
     * subscribes to the new beacon blocks stream.
     * @returns {BeaconBlockStream} - emits new beacon blocks as events
     */
    subscribeNewBeaconBlocks(): BeaconBlockStream;
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
declare class ExecutionPayloadStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleExecutionPayload;
}
declare class BeaconBlockStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleBeaconBlock;
    private decodeBellatrix;
    private decodeCapella;
    private decodeDeneb;
}
export { FilterBuilder };
