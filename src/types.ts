import rlp from "@ethereumjs/rlp";
import { TransactionFactory, TypedTransaction } from "@ethereumjs/tx";
import { Address } from "@ethereumjs/util";

export interface TransactionWithSender {
  sender: Address;
  transaction: TypedTransaction;
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
export function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction {
  let decodedRawTransaction = rlp.decode(raw) as Uint8Array;
  return TransactionFactory.fromSerializedData(decodedRawTransaction);
}
