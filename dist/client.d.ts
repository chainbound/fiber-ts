import { TypedTransaction as TypedTransaction } from "@ethereumjs/tx";
import { FilterBuilder } from "./filter.js";
import { TransactionResponse } from "./types.js";
import { TxStream } from "./stream/tx.js";
import { ExecutionPayloadStream } from "./stream/executionPayload.js";
import { BeaconBlockStream } from "./stream/beaconBlock.js";
import { TxRawStream } from "./stream/txRaw.js";
import { BeaconBlockRawStream } from "./stream/beaconBlockRaw.js";
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
     * subscribes to the new transactions stream.
     * @returns {TxRawStream} - emits new raw txs as events
     */
    subscribeNewRawTxs(filter?: FilterBuilder): TxRawStream;
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
     * subscribes to the new raw beacon blocks stream.
     * @returns {BeaconBlockRawStream} - emits new raw beacon blocks as events
     */
    subscribeNewRawBeaconBlocks(): BeaconBlockRawStream;
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
