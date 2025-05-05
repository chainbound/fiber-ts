import { Common, getPresetChainConfig, Hardfork } from "@ethereumjs/common";
import { KZG as microEthKZG } from "micro-eth-signer/kzg";
import { trustedSetup } from "@paulmillr/trusted-setups/fast.js";
/**
 * KZG setup, along with [`Common`] transaction options are needed
 * to support EIP-4844 type-3 transactions.
 *
 * References:
 *   - https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#kzg-setup
 *   - https://github.com/ethereumjs/ethereumjs-monorepo/blob/7c500b70b5f593a8811fc214a3b86085188da755/packages/tx/examples/blobTx.ts
 */
const kzg = new microEthKZG(trustedSetup);
export let common = new Common({
    chain: getPresetChainConfig("mainnet"),
    hardfork: Hardfork.Prague,
    customCrypto: { kzg },
});
