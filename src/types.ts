import rlp from "@ethereumjs/rlp";
import { TransactionFactory, TypedTransaction } from "@ethereumjs/tx";

import { Address } from "@ethereumjs/util";
import { bellatrix } from "@chainsafe/lodestar-types";

export interface TransactionWithSender {
  sender: Address;
  transaction: TypedTransaction;
}

export interface TransactionResponse {
  hash: string;
  timestamp: number;
}

export interface ExecutionPayload {
  header: bellatrix.ExecutionPayloadHeader;
  transactions: TypedTransaction[];
}

export function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction {
  let decodedRawTransaction = rlp.decode(raw) as Uint8Array;
  return TransactionFactory.fromSerializedData(decodedRawTransaction);
}
