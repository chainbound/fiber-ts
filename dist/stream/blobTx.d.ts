/// <reference types="node" resolution-mode="require"/>
import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Metadata } from "@grpc/grpc-js";
export declare class BlobTxStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
}
