import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb.js";
import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import type { BeaconBlockMsg } from "../../protobuf/api_pb.cjs";
import { EventEmitter } from "events";
import { Metadata } from "@grpc/grpc-js";

export class BeaconBlockRawStream extends EventEmitter {
  constructor(_client: APIClient, _md: Metadata) {
    super();
    this.retry(_client, _md);
  }

  async retry(_client: APIClient, _md: Metadata) {
    const now = new Date();
    const deadline = new Date(now.getTime() + 60 * 1000);
    await new Promise<void>((resolve, reject) => {
      _client.waitForReady(deadline, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const _blockStream = _client.subscribeBeaconBlocksV2(
      new google_protobuf_empty_pb.Empty(),
      _md
    );
    _blockStream.on("close", () => this.emit("close"));
    _blockStream.on("end", () => this.emit("end"));
    _blockStream.on("data", (data: BeaconBlockMsg) =>
      this.emit("data", data.getSszBlock_asU8())
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }
}
