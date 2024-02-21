import { TypedTransaction } from "@ethereumjs/tx";
import { Address } from "@ethereumjs/util";
export interface TransactionWithSender {
    sender: Address;
    transaction: TypedTransaction;
}
export interface TransactionRawWithSender {
    sender: Address;
    transaction: Uint8Array;
}
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export declare function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction;
