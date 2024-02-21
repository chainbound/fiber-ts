/// <reference types="node" resolution-mode="require"/>
import { Metadata } from "@grpc/grpc-js";
import { EventEmitter } from "events";
import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";
export declare class BeaconBlockStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleBeaconBlock;
    private decodeBellatrix;
    private decodeCapella;
    private decodeDeneb;
}
