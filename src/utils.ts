import { TransactionFactory, TypedTransaction } from "@ethereumjs/tx";

/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction {
  return TransactionFactory.fromSerializedData(raw as Uint8Array);
}
