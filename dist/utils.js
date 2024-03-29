import { TransactionFactory } from "@ethereumjs/tx";
import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { initKZG } from "@ethereumjs/util";
import { createKZG } from "kzg-wasm";
/**
 * KZG setup, along with [`Common`] transaction options are needed
 * to support EIP-4844 type-3 transactions.
 *
 * References:
 *   - https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#kzg-setup
 *   - https://github.com/ethereumjs/ethereumjs-monorepo/blob/7c500b70b5f593a8811fc214a3b86085188da755/packages/tx/examples/blobTx.ts
 */
const kzg = await createKZG();
initKZG(kzg, "");
export let common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
});
/**
 *
 * @param raw a raw transaction in RLP format
 * @returns an Ethereumjs TypedTransaction object
 */
export function fromRLPTransaction(raw) {
    return TransactionFactory.fromSerializedData(raw, { common });
}
