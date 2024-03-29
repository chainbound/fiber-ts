import { TypedTransaction as TypedTransactionLib, TransactionFactory as TransactionFactoryLib, BlobEIP4844Transaction as BlobEIP4844TransactionLib } from "@ethereumjs/tx";
import { bellatrix, capella, deneb } from "@lodestar/types";
import { Block as BlockLib } from "@ethereumjs/block";
import { Address as AddressLib } from "@ethereumjs/util";
export type DataVersion = 3 | 4 | 5;
/**
 * Helper type that wraps a signed beacon block from any of the supported hard-forks.
 *
 * This type will either contain a Bellatrix, Capella, or Deneb signed beacon block,
 * using the `@lodestar/types` types.
 *
 * DataVersion is used to indicate which type of payload is contained in the struct:
 * 3: Bellatrix, 4: Capella, 5: Deneb
 */
export type SignedBeaconBlock = {
    dataVersion: 3;
    block: bellatrix.SignedBeaconBlock;
} | {
    dataVersion: 4;
    block: capella.SignedBeaconBlock;
} | {
    dataVersion: 5;
    block: deneb.SignedBeaconBlock;
};
/**
 * Re-exported from `@ethereumjs/tx`
 */
export type TypedTransaction = TypedTransactionLib;
/**
 * Re-exported from `@ethereumjs/tx`
 */
export type TransactionFactory = TransactionFactoryLib;
/**
 * Re-exported from `@ethereumjs/tx`
 */
export type BlobEIP4844Transaction = BlobEIP4844TransactionLib;
/**
 * Re-exported from `@ethereumjs/block`
 */
export type Block = BlockLib;
/**
 * Re-exported from `@ethereumjs/util`
 */
export type Address = AddressLib;
/**
 * A wrapper type around `TypedTransaction` that includes the
 * ec-recovered sender's address for performance reasons.
 */
export interface TransactionWithSender {
    sender: Address;
    transaction: TypedTransaction;
}
/**
 * Includes the rlp-encoded transaction and the ec-recovered
 * sender's address for performance reasons.
 */
export interface TransactionRawWithSender {
    sender: Address;
    transaction: Uint8Array;
}
/**
 * A wrapper type around `BlobEIP4844Transaction` that includes the
 * ec-recovered sender's address for performance reasons.
 */
export interface BlobTransactionWithSender {
    sender: Address;
    transaction: BlobEIP4844Transaction;
}
/**
 * Includes the rlp-encoded blob transaction and the ec-recovered
 * sender's address for performance reasons.
 */
export interface BlobTransactionWithSender {
    sender: Address;
    transaction: BlobEIP4844Transaction;
}
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
