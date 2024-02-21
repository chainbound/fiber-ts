/// <reference types="node" resolution-mode="require"/>
import EventEmitter from "events";
import { APIClient } from "../../protobuf/api_grpc_pb.cjs";
import { Metadata } from "@grpc/grpc-js";
import { TxFilter } from "../../protobuf/api_pb.cjs";
export declare class TxRawStream extends EventEmitter {
    constructor(_client: APIClient, _md: Metadata, _filter: TxFilter);
    retry(_client: APIClient, _md: Metadata, _filter: TxFilter): Promise<void>;
}
