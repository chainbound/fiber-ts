const { Client } = require('../src/index'); // replace with fiber-ts
// I use ethers here but it doesn't really matter, you can use web3.js too.
const { ethers } = require('ethers');

async function main() {
    const client = new Client('FIBER_URL', 'YOUR_API_KEY');
    console.log('connecting');
    // Wait for the connection to set up (timeout of 10 seconds)
    await client.waitForReady(10);
    console.log('ready');

    // Subscribe to the new transactions stream
    const sub = client.subscribeNewTxs()

    let nonce = 41;
    const targetSender = 'TARGET_SENDER';
    const target = 'TARGET_RECEIVER';

    const wallet = new ethers.Wallet('PRIVATE_KEY')

    // On a transaction event, the callback handles the transaction
    sub.on('tx', async (tx) => {
        // If the sender is not our target, we return
        if (tx.getSenderAddress().toLowerCase() !== targetSender) {
            return
        }

        console.log(Date.now());
        console.log(tx.hash().toString('hex'));

        let signed;

        if (tx.type === 0) {
            // Legacy transaction (no EIP1559)
            signed = await wallet.signTransaction({
                type: 0,
                to: target,
                gasLimit: 21000,
                value: 0,
                nonce: nonce,
                gasPrice: tx.gasPrice,
                data: 'YOUR_CALLDATA',
            });
        } else {
            // Typed tx (EIP2930 or EIP1559)
            signed = await wallet.signTransaction({
                chainId: 1,
                type: 2,
                to: target,
                gasLimit: 21000,
                value: 0,
                nonce: nonce,
                maxFeePerGas: tx.maxFeePerGas,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
                data: 'YOUR_CALLDATA',
            });
        }

        // Signed should be a hex string containing the raw signed transaction
        console.log(signed);

        try {
            const res = await client.sendRawTransaction(signed);
            console.log(Date.now(), "backrun sent")
            console.log(res);
        } catch (err) {
            console.error(err)
        }
    })
}

main().then().catch(console.error)
