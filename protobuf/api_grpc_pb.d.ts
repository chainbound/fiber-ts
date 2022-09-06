// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as api_pb from "./api_pb";
import * as eth_pb from "./eth_pb";

interface IAPIService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    subscribeNewTxs: IAPIService_ISubscribeNewTxs;
    subscribeNewBlocks: IAPIService_ISubscribeNewBlocks;
    sendTransaction: IAPIService_ISendTransaction;
    backrun: IAPIService_IBackrun;
}

interface IAPIService_ISubscribeNewTxs extends grpc.MethodDefinition<api_pb.TxFilter, eth_pb.Transaction> {
    path: "/api.API/SubscribeNewTxs";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<api_pb.TxFilter>;
    requestDeserialize: grpc.deserialize<api_pb.TxFilter>;
    responseSerialize: grpc.serialize<eth_pb.Transaction>;
    responseDeserialize: grpc.deserialize<eth_pb.Transaction>;
}
interface IAPIService_ISubscribeNewBlocks extends grpc.MethodDefinition<api_pb.BlockFilter, eth_pb.Block> {
    path: "/api.API/SubscribeNewBlocks";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<api_pb.BlockFilter>;
    requestDeserialize: grpc.deserialize<api_pb.BlockFilter>;
    responseSerialize: grpc.serialize<eth_pb.Block>;
    responseDeserialize: grpc.deserialize<eth_pb.Block>;
}
interface IAPIService_ISendTransaction extends grpc.MethodDefinition<eth_pb.Transaction, api_pb.TransactionResponse> {
    path: "/api.API/SendTransaction";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<eth_pb.Transaction>;
    requestDeserialize: grpc.deserialize<eth_pb.Transaction>;
    responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_IBackrun extends grpc.MethodDefinition<api_pb.BackrunMsg, api_pb.TransactionResponse> {
    path: "/api.API/Backrun";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<api_pb.BackrunMsg>;
    requestDeserialize: grpc.deserialize<api_pb.BackrunMsg>;
    responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}

export const APIService: IAPIService;

export interface IAPIServer extends grpc.UntypedServiceImplementation {
    subscribeNewTxs: grpc.handleServerStreamingCall<api_pb.TxFilter, eth_pb.Transaction>;
    subscribeNewBlocks: grpc.handleServerStreamingCall<api_pb.BlockFilter, eth_pb.Block>;
    sendTransaction: grpc.handleUnaryCall<eth_pb.Transaction, api_pb.TransactionResponse>;
    backrun: grpc.handleUnaryCall<api_pb.BackrunMsg, api_pb.TransactionResponse>;
}

export interface IAPIClient {
    subscribeNewTxs(request: api_pb.TxFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    subscribeNewTxs(request: api_pb.TxFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    subscribeNewBlocks(request: api_pb.BlockFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    subscribeNewBlocks(request: api_pb.BlockFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    sendTransaction(request: eth_pb.Transaction, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    sendTransaction(request: eth_pb.Transaction, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    sendTransaction(request: eth_pb.Transaction, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    backrun(request: api_pb.BackrunMsg, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    backrun(request: api_pb.BackrunMsg, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    backrun(request: api_pb.BackrunMsg, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
}

export class APIClient extends grpc.Client implements IAPIClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public subscribeNewTxs(request: api_pb.TxFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    public subscribeNewTxs(request: api_pb.TxFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    public subscribeNewBlocks(request: api_pb.BlockFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    public subscribeNewBlocks(request: api_pb.BlockFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    public sendTransaction(request: eth_pb.Transaction, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    public sendTransaction(request: eth_pb.Transaction, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    public sendTransaction(request: eth_pb.Transaction, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    public backrun(request: api_pb.BackrunMsg, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    public backrun(request: api_pb.BackrunMsg, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
    public backrun(request: api_pb.BackrunMsg, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.TransactionResponse) => void): grpc.ClientUnaryCall;
}
