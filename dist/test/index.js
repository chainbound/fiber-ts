import dotenv from "dotenv";
dotenv.config();
import { Client } from "../client.js";
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
    // let filter = new FilterBuilder(
    //   or(
    //     to("0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"),
    //     to("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488d")
    //   )
    // );
    //
    // console.log(`filter: ${filter.toString()}`);
    console.log("Subscribing to new txs");
    let subTxs = client.subscribeNewTxs();
    subTxs.on("data", (tx) => {
        console.log(`New tx received: ${tx.transaction.hash()}`);
    });
    console.log("Subscribing to new txs raw");
    let subRawTxs = client.subscribeNewRawTxs();
    subRawTxs.on("data", (tx) => {
        console.log(`New raw tx received: ${tx.transaction.slice(0, 10)}...${tx.transaction.slice(-10)}`);
    });
    console.log("Subscribing to new blob txs");
    let subBlobTxs = client.subscribeNewBlobTxs();
    subBlobTxs.on("data", (tx) => {
        console.log(`New blob tx received: ${tx.transaction.hash()}`);
    });
    console.log("Subscribing to new blob txs raw");
    let subBlobRawTxs = client.subscribeNewBlobRawTxs();
    subBlobRawTxs.on("data", (tx) => {
        console.log(`New raw tx received: ${tx.transaction.slice(0, 10)}...${tx.transaction.slice(-10)}`);
    });
    // console.log("Subscribing new execution payloads");
    // let subExecutionPayload = client.subscribeNewExecutionPayloads();
    //
    // subExecutionPayload.on("data", (block: Block) => {
    //   console.log(`New block received: ${block.hash()}`);
    // });
    //
    // console.log("Subscribing new beacon blocks");
    // let subBeaconBlocks = client.subscribeNewBeaconBlocks();
    //
    // subBeaconBlocks.on("data", (data: SignedBeaconBlock) => {
    //   console.log(`New beacon block received: ${data.block.message.slot}`);
    // });
    //
    // console.log("Subscribing new raw beacon blocks");
    // let subRawBeaconBlocks = client.subscribeNewRawBeaconBlocks();
    //
    // subRawBeaconBlocks.on("data", (block: Uint8Array) => {
    //   console.log(
    //     `New raw beacon block received: ${block.slice(0, 10)}...${block.slice(-10)}`
    //   );
    // });
    //
    // let wallet = new ethers.Wallet(PRIVATE_KEY);
    //
    // let tx = await wallet.signTransaction({
    //   nonce: 0,
    //   gasPrice: 1,
    //   gasLimit: 21000,
    //   to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
    //   data: Buffer.from(""),
    //   value: 1,
    // });
    //
    // let txr = await client.sendRawTransaction(tx);
    // console.log(`tx: ${txr}`);
}
main().then().catch(console.error);
