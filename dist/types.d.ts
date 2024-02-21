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
