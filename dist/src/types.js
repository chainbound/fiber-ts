import rlp from "@ethereumjs/rlp";
import { TransactionFactory } from "@ethereumjs/tx";
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export function fromRLPTransaction(raw) {
    let decodedRawTransaction = rlp.decode(raw);
    return TransactionFactory.fromSerializedData(decodedRawTransaction);
}
//# sourceMappingURL=types.js.map