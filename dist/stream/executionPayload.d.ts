/// <reference types="node" resolution-mode="require"/>
import type { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { EventEmitter } from "events";
import { Metadata } from "@grpc/grpc-js";
export declare class ExecutionPayloadStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata);
    retry(_client: APIClient, _md: Metadata): Promise<void>;
    private handleExecutionPayload;
}
