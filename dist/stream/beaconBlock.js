import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb.js";
import { ssz } from "@lodestar/types";
import { EventEmitter } from "events";
export class BeaconBlockStream extends EventEmitter {
    constructor(_client, _md) {
        super();
        this.retry(_client, _md);
    }
    async retry(_client, _md) {
        const now = new Date();
        const deadline = new Date(now.getTime() + 60 * 1000);
        await new Promise((resolve, reject) => {
            _client.waitForReady(deadline, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const _blockStream = _client.subscribeBeaconBlocksV2(new google_protobuf_empty_pb.Empty(), _md);
        _blockStream.on("close", () => this.emit("close"));
        _blockStream.on("end", () => this.emit("end"));
        _blockStream.on("data", (data) => this.emit("data", this.handleBeaconBlock(data)));
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleBeaconBlock(block) {
        const version = block.getDataVersion();
        const sszEncodedBeaconBlock = block.getSszBlock();
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
    decodeBellatrix(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
    decodeCapella(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.capella.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
    decodeDeneb(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.deneb.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded.message;
    }
}
