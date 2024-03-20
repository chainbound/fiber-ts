import { TypedTransaction } from "@ethereumjs/tx";
import { Common } from "@ethereumjs/common";
export declare let common: Common;
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export declare function fromRLPTransaction(raw: string | Uint8Array): TypedTransaction;
