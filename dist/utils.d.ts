import { TypedTransaction } from "@ethereumjs/tx";
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export declare function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction;
