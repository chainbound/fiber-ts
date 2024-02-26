import { default as google_protobuf_empty_pb } from "google-protobuf/google/protobuf/empty_pb.js";
import { Metadata } from "@grpc/grpc-js";
import { ssz } from "@lodestar/types";
import { SignedBeaconBlock } from "@lodestar/types/allForks";
import { EventEmitter } from "events";
import type { BeaconBlockMsg } from "../../protobuf/api_pb.cjs";
import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import {
  DataVersion,
  SignedBeaconBlock as SignedBeaconBlockVersioned,
} from "../types.js";

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
    _blockStream.on("data", (data: BeaconBlockMsg) => {
      const dataVersion = data.getDataVersion() as DataVersion;
      const block = this.handleBeaconBlock(data);
      const res = { dataVersion, block };

      this.emit("data", res);
    });

    _blockStream.on("error", async (err) => {
      console.error("transmission error", err);
      this.retry(_client, _md);
    });
  }

  private handleBeaconBlock(block: BeaconBlockMsg): SignedBeaconBlock {
    const version = block.getDataVersion() as DataVersion;

    const sszEncodedBeaconBlock = block.getSszBlock() as Uint8Array;
    let decodedBlock: SignedBeaconBlock;
    switch (version) {
      case 3: {
        decodedBlock = this.decodeBellatrix(sszEncodedBeaconBlock);
        break;
      }
      case 4: {
        decodedBlock = this.decodeCapella(sszEncodedBeaconBlock);
        break;
      }
      case 5: {
        decodedBlock = this.decodeDeneb(sszEncodedBeaconBlock);
        break;
      }
      default: {
        decodedBlock = this.decodeCapella(sszEncodedBeaconBlock);
      }
    }
    return decodedBlock;
  }

  private decodeBellatrix(sszEncodedBeaconBlock: Uint8Array): SignedBeaconBlock {
    const decoded =
      ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded;
  }

  private decodeCapella(sszEncodedBeaconBlock: Uint8Array): SignedBeaconBlock {
    const decoded =
      ssz.allForks.capella.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded;
  }

  private decodeDeneb(sszEncodedBeaconBlock: Uint8Array): SignedBeaconBlock {
    const decoded =
      ssz.allForks.deneb.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
    return decoded;
  }
}
