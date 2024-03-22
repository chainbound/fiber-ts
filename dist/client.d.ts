import { TypedTransaction } from "@ethereumjs/tx";
import { TxStream, ExecutionPayloadStream, BeaconBlockStream, TxRawStream, BeaconBlockRawStream } from "./stream/index.js";
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
     * Subscribes to the new transactions stream.
     * @returns {TxStream} emits new txs with sender of type `TransactionWithSender` as events
     */
    subscribeNewTxs(filter?: FilterBuilder): TxStream;
    /**
     * Subscribes to the new transactions stream.
     * @returns {TxRawStream} emits new raw txs with sender of type `TransactionRawWithSender` as events
     */
    subscribeNewRawTxs(filter?: FilterBuilder): TxRawStream;
    /**
     * Subscribes to the new transactions stream.
     * @returns {TxStream} emits new txs with sender of type `BlobTransactionWithSender` as events
     */
    subscribeNewBlobTxs(): TxStream;
    /**
     * Subscribes to the new transactions stream.
     * @returns {TxStream} emits new txs with sender of type `TransactionRawWithSender` as events
     *
     * Note: transactions are returned with the "raw format" `type || rlp([tx_payload_body, blobs,
     * commitments, proofs])` compatible with the `eth_sendRawTransaction` RPC
     */
    subscribeNewBlobRawTxs(): TxStream;
    /**
     * Subscribes to the new execution payloads stream.
     * @returns {ExecutionPayloadStream} emits new blocks of type `Block` as events (with transactions)
     */
    subscribeNewExecutionPayloads(): ExecutionPayloadStream;
    /**
     * Subscribes to the new beacon blocks stream.
     * @returns {BeaconBlockStream} emits new beacon blocks of type `BeaconBlock` as events
     */
    subscribeNewBeaconBlocks(): BeaconBlockStream;
    /**
     * Subscribes to the new raw beacon blocks stream.
     * @returns {BeaconBlockRawStream} emits new raw ssz-encoded beacon blocks of type `Uint8Array` as events
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
