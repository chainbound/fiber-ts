# Fiber TypeScript Client
This package contains a JS/TS client for connecting to the Fiber Network.

## Usage
### Installation
```bash
npm i fiber-ts
# or 
yarn add fiber-ts
```
### Connecting
```ts
import { Client } from 'fiber-ts';

const client = new Client('YOUR_API_HERE');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);
```

### Subscriptions
The client exposes 2 subscriptions: **transactions** and **blocks**.
They are implemented as event emitters which you can listen to.
#### Transactions
`fiber-ts` works with [ethers](https://docs.ethers.io/v5/) internally, and transactions are implemented as
`ethers.Transaction`.
```ts
import { Client } from 'fiber-ts';
import { ethers } from 'ethers';

const client = new Client('YOUR_API_HERE');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const sub = client.subscribeNewTxs();

sub.on('tx', (tx: ethers.Transaction) => {
    handleTx(tx);
});
```

#### Blocks
Blocks have their own type: `fiber-ts.Block`. The list of transactions are once again `ethers.Transaction`s.

```ts
import { Client, Block } from 'fiber-ts';

const client = new Client('YOUR_API_HERE');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const sub = client.subscribeNewBlocks();

sub.on('block', (block: Block) => {
    handleBlock(block);
});
```

### Sending Transactions
`fiber-ts` has 2 endpoints for sending transactions:
* `client.sendTransaction` for just sending a normal transaction.
* `client.backrunTransaction` for backrunning a transaction.

#### `sendTransaction`
```ts
import { Client, TransactionResponse } from 'fiber-ts';
import { ethers } from 'ethers';

const client = new Client('YOUR_API_HERE');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const wallet = new ethers.Wallet('PRIVATE_KEY')

// Sign the transaction
let signed = await wallet.signTransaction({
    chainId: 1,
    type: 2,
    to: '0x...',
    gasLimit: 21000,
    value: 0,
    nonce: 21,
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'),
});

// Parse the transaction to use with client
const parsed = ethers.utils.parseTransaction(signed);

// Result contains the timestamp (unix microseconds) and hash of the transaction
const result: TransactionResponse = await client.sendTransaction(parsed);
```
#### `backrunTransaction`
This endpoint is specifically for backrunning a transaction. It takes a target transaction
hash as well as a new transaction (backrun transaction), and makes sure the 2 transactions are propagated
in a bundle. Assuming the gas price of these transactions is the same, the backrun transaction will never
arrive before the target transaction at a block producer, ensuring the correct sequence.

```ts
import { Client, TransactionResponse } from 'fiber-ts';
import { ethers } from 'ethers';

const client = new Client('YOUR_API_HERE');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const wallet = new ethers.Wallet('PRIVATE_KEY')

// Sign the transaction
let signed = await wallet.signTransaction({
    chainId: 1,
    type: 2,
    to: '0x...',
    gasLimit: 21000,
    value: 0,
    nonce: 21,
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'),
});

// Parse the transaction to use with client
const parsed = ethers.utils.parseTransaction(signed);
const targetHash = '0xabcd...'

// Result contains the timestamp (unix microseconds) and hash of the transaction
const result: TransactionResponse = await client.backrunTransaction(targetHash, parsed);
```