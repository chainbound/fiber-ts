import { TransactionFactory } from "@ethereumjs/tx";
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export function fromRLPTransaction(raw) {
    return TransactionFactory.fromSerializedData(raw);
}
