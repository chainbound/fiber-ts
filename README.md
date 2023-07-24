# Fiber TypeScript Client

This package contains a JS/TS client for connecting to the Fiber Network.

## Examples

You can find some examples in the [examples directory](./examples).

## Usage

### Installation

```bash
npm i fiber-ts
# or
yarn add fiber-ts
```

### Connecting

```ts
import { Client } from "fiber-ts";

const client = new Client("fiber.example.io", "YOUR_API_KEY");

// Wait up to 10 seconds for the client to connect.
await client.waitForReady(10);
```

### Subscriptions

The client exposes 2 subscriptions: **transactions** and **blocks**.
They are implemented as event emitters which you can listen to.

#### Transactions

`fiber-ts` works with [ethereumjs](https://github.com/ethereumjs/ethereumjs-monorepo) internally,
and transactions are implemented as `@ethereumjs/tx.TypedTransaction`.
This is for a couple reasons, but most importantly performance.

Filtering functionality is currently a work in progress. The filter object passed to SubscribeNewTxs is a simple **OR** filter, so if a transaction matches either to `to`, `from` or `methodid` field, it will be sent on the stream.

```ts
import { Client, FilterBuilder, or, to } from "fiber-ts";
import { TypedTransaction } from "@ethereumjs/tx";

const client = new Client("fiber.example.io", "YOUR_API_KEY");

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

let filter = new FilterBuilder(
  or(
    to("0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"),
    to("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488d")
  )
);

const sub = client.subscribeNewTxs(filter);

sub.onData((tx: TypedTransaction) => {
  handleTx(tx);
});
```

#### Blocks

Blocks have their own type: `fiber-ts.Block`. The list of transactions are once again `TypedTransaction`s.

```ts
import { Client, Block } from "fiber-ts";

const client = new Client("fiber.example.io", "YOUR_API_KEY");

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const sub = client.subscribeNewBlocks();

sub.onData((block: Block) => {
  handleBlock(block);
});
```

### Sending Transactions

`fiber-ts` has 4 endpoints for sending transactions:

- `client.sendTransaction` for just sending a normal transaction.
- `client.sendRawTransaction` for sending a raw transaction (signed with ethers or web3.js).
- `client.sendTransactionSequence` for sending a sequence of normal transactions in a row. Please remember that the ordering is not guaranteed on-chain, as the final ordering is determined by the block producer.
- `client.sendRawTransactionSequence` for sending a sequence of raw transactions (signed with ethers or web3.js)

For constructing transactions, we recommend using `TransactionFactory`. This will automatically
create a typed transaction from the given transaction data.

#### `sendTransaction`

```ts
import { Client, TransactionResponse } from "fiber-ts";
import { TypedTransaction, TransactionFactory } from "@ethereumjs/tx";

const client = new Client("fiber.example.io", "YOUR_API_KEY");

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const pk = Buffer.from("PRIVATE_KEY", "hex");

// Build an EIP1559 TypedTransaction with ethereumjs
const tx = TransactionFactory.fromTxData({
  chainId: 1,
  type: 2,
  to: "0x...",
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
import { Client } from "fiber-ts";
import { ethers } from "ethers";

const wallet = new ethers.Wallet("PRIVATE_KEY");

const signedTx = await wallet.signTransaction({
  chainId: 1,
  type: 2,
  to: "0x...",
  gasLimit: 21000,
  value: 0,
  nonce: 21,
  maxFeePerGas: 20 * 1e9,
  maxPriorityFeePerGas: 2 * 1e9,
});

const result = await client.sendRawTransaction(signedTx);
```

#### `sendTransactionSequence`

This endpoint is built to send an array of transactions to land on the same block. Ordering is not guaranteed because of Ethereum's PBS system which delegates this power to the block builders.

It takes an array of transactions as input, and makes sure these transactions are propagated in a bundle. Assuming the gas price of these transactions is the same, the backrun transaction will never arrive before the target transaction at a block producer.

```ts
import { Client, TransactionResponse } from "fiber-ts";
import { TypedTransaction, TransactionFactory } from "@ethereumjs/tx";

const client = new Client("fiber.example.io", "YOUR_API_KEY");

// Wait 10 seconds for the client to connect.
await client.waitForReady(10);

const pk = Buffer.from("PRIVATE_KEY", "hex");

const txToBackrun = "0xdeadbeef...";

// Build a TypedTransaction with ethereumjs
const tx = TransactionFactory.fromTxData({
  chainId: 1,
  type: 2,
  to: "0x...",
  gasLimit: 21000,
  value: 0,
  nonce: 21,
  maxFeePerGas: 20 * 1e9,
  maxPriorityFeePerGas: 2 * 1e9,
});

const signed = tx.sign(pk);

// Result contains the timestamp (unix microseconds) and hash of the transaction
const result: TransactionResponse = await client.sendTransactionSequence([
  txToBackrun,
  signed,
]);
```

#### `sendRawTransactionSequence`

```ts
import { Client } from "fiber-ts";
import { ethers } from "ethers";

const wallet = new ethers.Wallet("PRIVATE_KEY");

const txToBackrun = "0xdeadbeef...";

const signedTx = await wallet.signTransaction({
  chainId: 1,
  type: 2,
  to: "0x...",
  gasLimit: 21000,
  value: 0,
  nonce: 21,
  maxFeePerGas: 20 * 1e9,
  maxPriorityFeePerGas: 2 * 1e9,
});

const result = await client.sendRawTransactionSequence([txToBackrun, signedTx]);
```
