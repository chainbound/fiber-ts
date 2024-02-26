import { default as google_protobuf_empty_pb } from "google-protobuf/google/protobuf/empty_pb.js";
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
        _blockStream.on("data", (data) => {
            const dataVersion = data.getDataVersion();
            const block = this.handleBeaconBlock(data);
            const res = { dataVersion, block };
            this.emit("data", res);
        });
        _blockStream.on("error", async (err) => {
            console.error("transmission error", err);
            this.retry(_client, _md);
        });
    }
    handleBeaconBlock(block) {
        const version = block.getDataVersion();
        const sszEncodedBeaconBlock = block.getSszBlock();
        let decodedBlock;
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
    decodeBellatrix(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.bellatrix.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded;
    }
    decodeCapella(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.capella.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded;
    }
    decodeDeneb(sszEncodedBeaconBlock) {
        const decoded = ssz.allForks.deneb.SignedBeaconBlock.deserialize(sszEncodedBeaconBlock);
        return decoded;
    }
}
