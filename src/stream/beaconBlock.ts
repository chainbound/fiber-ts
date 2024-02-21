import { default as google_protobuf_empty_pb } from "google-protobuf/google/protobuf/empty_pb.js";
import { Metadata } from "@grpc/grpc-js";
import { ssz, allForks } from "@lodestar/types";
import { EventEmitter } from "events";
import type { BeaconBlockMsg } from "../../protobuf/api_pb.cjs";
import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";
type BeaconBlock = allForks.BeaconBlock;

export class BeaconBlockStream extends EventEmitter {
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
      this.emit("data", this.handleBeaconBlock(data))
    );

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBeaconBlock(block: BeaconBlockMsg): BeaconBlock {
    const version = block.getDataVersion();

    const sszEncodedBeaconBlock = block.getSszBlock() as Uint8Array;
    switch (version) {
      case 3: {
        return this.decodeBellatrix(sszEncodedBeaconBlock);
      }
      case 4: {
        return this.decodeCapella(sszEncodedBeaconBlock);
      }
      case 5: {
        return this.decodeDeneb(sszEncodedBeaconBlock);
      }
      default: {
        return this.decodeCapella(sszEncodedBeaconBlock);
      }
    }
  }

  private decodeBellatrix(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded =
      ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded.message;
  }

  private decodeCapella(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded =
      ssz.allForks.capella.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded.message;
  }

  private decodeDeneb(sszEncodedBeaconBlock: Uint8Array): BeaconBlock {
    const decoded =
      ssz.allForks.deneb.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded.message;
  }
}
