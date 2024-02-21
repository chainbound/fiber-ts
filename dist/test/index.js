import dotenv from "dotenv";
dotenv.config();
import { Client } from "../client.js";
import { FilterBuilder, or, to } from "../filter.js";
import { ethers } from "ethers";
const PRIVATE_KEY = process.env["PRIVATE_KEY"];
const FIBER_TARGET = process.env["FIBER_TARGET"];
const API_KEY = process.env["API_KEY"];
async function main() {
    const client = new Client(
    // "localhost:8085",
    FIBER_TARGET, API_KEY);
    console.log("Waiting for gRPC client to be ready");
    await client.waitForReady(10);
    console.log("gRPC client is ready");
    let filter = new FilterBuilder(or(to("0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"), to("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488d")));
    console.log(`filter: ${filter.toString()}`);
    console.log("Subscribing to new txs");
    let subTxs = client.subscribeNewTxs();
    subTxs.on("data", (tx) => {
        console.log(`New tx received: ${tx}`);
    });
    console.log("Subscribing to new txs raw");
    let subRawTxs = client.subscribeNewRawTxs();
    subRawTxs.on("data", (tx) => {
        console.log(`New raw tx received: ${tx}`);
    });
    console.log("Subscribing new execution payloads");
    let subExecutionPayload = client.subscribeNewExecutionPayloads();
    subExecutionPayload.on("data", (block) => {
        console.log(`New block received: ${block}`);
    });
    console.log("Subscribing new beacon blocks");
    let subBeaconBlocks = client.subscribeNewBeaconBlocks();
    subBeaconBlocks.on("data", (block) => {
        console.log(`New beacon block received: ${block}`);
    });
    console.log("Subscribing new raw beacon blocks");
    let subRawBeaconBlocks = client.subscribeNewRawBeaconBlocks();
    subRawBeaconBlocks.on("data", (_block) => {
        console.log(`New raw beacon block received`);
    });
    let wallet = new ethers.Wallet(PRIVATE_KEY);
    let tx = await wallet.signTransaction({
        nonce: 0,
        gasPrice: 1,
        gasLimit: 21000,
        to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
        data: Buffer.from(""),
        value: 1,
    });
    let txr = await client.sendRawTransaction(tx);
    console.log(`tx: ${txr}`);
}
main().then().catch(console.error);
