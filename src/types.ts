import { TypedTransaction as TypedTransactionLib } from "@ethereumjs/tx";
import { BeaconBlock as BeaconBlockLib } from "@lodestar/types/allForks";
import { Block as BlockLib } from "@ethereumjs/block";
import { Address } from "@ethereumjs/util";

/**
 * Re-exported from `@ethereumjs/tx`
 */
export type TypedTransaction = TypedTransactionLib;

/**
 * Re-exported from `@lodestar/types/allForks`
 */
export type BeaconBlock = BeaconBlockLib;

/**
 * Re-exported from `@ethereumjs/block`
 */
export type Block = BlockLib;

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
