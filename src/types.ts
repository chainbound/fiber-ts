import { TypedTransaction as TypedTransactionLib } from "@ethereumjs/tx";
import { SignedBeaconBlock as SignedBeaconBlockLib } from "@lodestar/types/allForks";
import { Block as BlockLib } from "@ethereumjs/block";
import { Address } from "@ethereumjs/util";

/**
 * Re-exported from `@ethereumjs/tx`
 */
export type TypedTransaction = TypedTransactionLib;

type BeaconBlockExecutionPayload = Extract<
  SignedBeaconBlockLib,
  { message: { body: { executionPayload: any } } }
>["message"]["body"]["executionPayload"];

/**
 * Re-exported from `@lodestar/types/allForks`, but where
 * `executionPayload` can be `undefined` depending on the hard fork.
 */
export type SignedBeaconBlock = SignedBeaconBlockLib & {
  message: { body: { executionPayload: BeaconBlockExecutionPayload | undefined } };
};

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
