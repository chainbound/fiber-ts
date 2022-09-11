"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const tx_1 = require("@ethereumjs/tx");
async function main() {
    // const client = new Client("fiber-node.fly.dev:8080")
    const client = new index_1.Client("localhost:8080", "fiber/v0.0.2-alpha/test-key-123");
    console.log('connecting');
    await client.waitForReady(10);
    console.log('ready');
    const sub = client.subscribeNewTxs();
    let nonce = 41;
    const target = "0x7d964A1A4D08B16A961E8d2AEA1393EC05Da11E3".toLowerCase();
    const pk = Buffer.from('15bb7dd02dd8805338310f045ae9975aedb7c90285618bd2ecdc91db52170a90', 'hex');
    sub.once('tx', async (tx) => {
        console.log(Date.now());
        console.log(tx.hash().toString('hex'));
        let snipe;
        if (tx.type === 0) {
            let legacy = tx;
            snipe = tx_1.Transaction.fromTxData({
                type: 0,
                to: target,
                gasLimit: 21000,
                value: 0,
                nonce: nonce,
                gasPrice: legacy.gasPrice,
            });
        }
        else {
            tx = tx;
            snipe = tx_1.FeeMarketEIP1559Transaction.fromTxData({
                chainId: 1,
                type: 2,
                to: target,
                gasLimit: 21000,
                value: 0,
                nonce: nonce,
                maxFeePerGas: 20 * 1e9,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
            });
        }
        const signed = snipe.sign(pk);
        try {
            const res = await client.backrunTransaction("0x" + tx.hash().toString('hex'), signed);
            nonce++;
            console.log(Date.now(), "snipe sent");
            // const res = await client.sendTransaction(parsed);
            console.log(res);
        }
        catch (err) {
            console.error(err);
        }
    });
}
main().then().catch(console.error);
