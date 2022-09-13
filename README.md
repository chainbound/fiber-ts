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

const client = new Client('fiber.example.io', 'YOUR_API_KEY');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);
```

### Subscriptions
The client exposes 2 subscriptions: **transactions** and **blocks**.
They are implemented as event emitters which you can listen to.
#### Transactions
`fiber-ts` works with [ethereumjs](https://github.com/ethereumjs/ethereumjs-monorepo) internally, 
and transactions are implemented as `@ethereumjs/tx.TypedTransaction`.
This is for a couple reasons, but most importantly performance.
```ts
import { Client } from 'fiber-ts';
import { TypedTransaction } from '@ethereumjs/tx';

const client = new Client('fiber.example.io', 'YOUR_API_KEY');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const sub = client.subscribeNewTxs();

sub.on('tx', (tx: TypedTransaction) => {
    handleTx(tx);
});
```

#### Blocks
Blocks have their own type: `fiber-ts.Block`. The list of transactions are once again `TypedTransaction`s.

```ts
import { Client, Block } from 'fiber-ts';

const client = new Client('fiber.example.io', 'YOUR_API_KEY');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const sub = client.subscribeNewBlocks();

sub.on('block', (block: Block) => {
    handleBlock(block);
});
```

### Sending Transactions
`fiber-ts` has 3 endpoints for sending transactions:
* `client.sendTransaction` for just sending a normal transaction.
* `client.sendRawTransaction` for sending a raw transaction (signed with ethers or web3.js).
* `client.backrunTransaction` for backrunning a transaction.

For constructing transactions, I recommend using `TransactionFactory`. This will automatically
create a typed transaction from the given transaction data.

#### `sendTransaction`
```ts
import { Client, TransactionResponse } from 'fiber-ts';
import { TypedTransaction, TransactionFactory } from '@ethereumjs/tx';

const client = new Client('fiber.example.io', 'YOUR_API_KEY');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const pk = Buffer.from('PRIVATE_KEY', 'hex');

// Build an EIP1559 TypedTransaction with ethereumjs
const tx = TransactionFactory.fromTxData({
    chainId: 1,
    type: 2,
    to: '0x...',
    gasLimit: 21000,
    value: 0,
    nonce: 21,
    maxFeePerGas: 20 * 1e9,
    maxPriorityFeePerGas: 2 * 1e9,
});

// Sign the transaction
const signed = tx.sign(pk);

// Result contains the timestamp (unix microseconds) and hash of the transaction
const result: TransactionResponse = await client.sendTransaction(signed);
```
#### `sendRawTransaction`
```ts
import { Client } from 'fiber-ts';
import { ethers } from 'ethers';

const wallet = new ethers.Wallet('PRIVATE_KEY');

const signedTx = await wallet.signTransaction({
    chainId: 1,
    type: 2,
    to: '0x...',
    gasLimit: 21000,
    value: 0,
    nonce: 21,
    maxFeePerGas: 20 * 1e9,
    maxPriorityFeePerGas: 2 * 1e9,
});

const result = await client.sendRawTransaction(signedTx);
```
#### `backrunTransaction`
This endpoint is specifically for backrunning a transaction. It takes a target transaction
hash as well as a new transaction (backrun transaction), and makes sure the 2 transactions are propagated
in a bundle. Assuming the gas price of these transactions is the same, the backrun transaction will never
arrive before the target transaction at a block producer, ensuring the correct sequence.

```ts
import { Client, TransactionResponse } from 'fiber-ts';
import { TypedTransaction, TransactionFactory } from '@ethereumjs/tx';

const client = new Client('fiber.example.io', 'YOUR_API_KEY');

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const pk = Buffer.from('PRIVATE_KEY', 'hex');

// Build a TypedTransaction with ethereumjs
const tx = TransactionFactory.fromTxData({
    chainId: 1,
    type: 2,
    to: '0x...',
    gasLimit: 21000,
    value: 0,
    nonce: 21,
    maxFeePerGas: 20 * 1e9,
    maxPriorityFeePerGas: 2 * 1e9,
});

const signed = tx.sign(pk);
const targetHash = '0xdeadbeef...'

// Result contains the timestamp (unix microseconds) and hash of the transaction
const result: TransactionResponse = await client.backrunTransaction(targetHash, signed);
```
