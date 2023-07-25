// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as api_pb from "./api_pb";
import * as eth_pb from "./eth_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAPIService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    subscribeNewTxs: IAPIService_ISubscribeNewTxs;
    sendTransaction: IAPIService_ISendTransaction;
    sendRawTransaction: IAPIService_ISendRawTransaction;
    sendTransactionSequence: IAPIService_ISendTransactionSequence;
    sendRawTransactionSequence: IAPIService_ISendRawTransactionSequence;
    subscribeNewBlocks: IAPIService_ISubscribeNewBlocks;
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
interface IAPIService_ISendTransaction extends grpc.MethodDefinition<eth_pb.Transaction, api_pb.TransactionResponse> {
    path: "/api.API/SendTransaction";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<eth_pb.Transaction>;
    requestDeserialize: grpc.deserialize<eth_pb.Transaction>;
    responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_ISendRawTransaction extends grpc.MethodDefinition<api_pb.RawTxMsg, api_pb.TransactionResponse> {
    path: "/api.API/SendRawTransaction";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<api_pb.RawTxMsg>;
    requestDeserialize: grpc.deserialize<api_pb.RawTxMsg>;
    responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_ISendTransactionSequence extends grpc.MethodDefinition<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse> {
    path: "/api.API/SendTransactionSequence";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<api_pb.TxSequenceMsg>;
    requestDeserialize: grpc.deserialize<api_pb.TxSequenceMsg>;
    responseSerialize: grpc.serialize<api_pb.TxSequenceResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TxSequenceResponse>;
}
interface IAPIService_ISendRawTransactionSequence extends grpc.MethodDefinition<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse> {
    path: "/api.API/SendRawTransactionSequence";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<api_pb.RawTxSequenceMsg>;
    requestDeserialize: grpc.deserialize<api_pb.RawTxSequenceMsg>;
    responseSerialize: grpc.serialize<api_pb.TxSequenceResponse>;
    responseDeserialize: grpc.deserialize<api_pb.TxSequenceResponse>;
}
interface IAPIService_ISubscribeNewBlocks extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, eth_pb.Block> {
    path: "/api.API/SubscribeNewBlocks";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<eth_pb.Block>;
    responseDeserialize: grpc.deserialize<eth_pb.Block>;
}

export const APIService: IAPIService;

export interface IAPIServer extends grpc.UntypedServiceImplementation {
    subscribeNewTxs: grpc.handleServerStreamingCall<api_pb.TxFilter, eth_pb.Transaction>;
    sendTransaction: grpc.handleBidiStreamingCall<eth_pb.Transaction, api_pb.TransactionResponse>;
    sendRawTransaction: grpc.handleBidiStreamingCall<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    sendTransactionSequence: grpc.handleBidiStreamingCall<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    sendRawTransactionSequence: grpc.handleBidiStreamingCall<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    subscribeNewBlocks: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, eth_pb.Block>;
}

export interface IAPIClient {
    subscribeNewTxs(request: api_pb.TxFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    subscribeNewTxs(request: api_pb.TxFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    sendTransaction(): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
    sendTransaction(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
    sendTransaction(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
    sendRawTransaction(): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    sendRawTransaction(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    sendRawTransaction(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    sendTransactionSequence(): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    sendTransactionSequence(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    sendTransactionSequence(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    sendRawTransactionSequence(): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    sendRawTransactionSequence(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    sendRawTransactionSequence(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    subscribeNewBlocks(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    subscribeNewBlocks(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
}

export class APIClient extends grpc.Client implements IAPIClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public subscribeNewTxs(request: api_pb.TxFilter, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    public subscribeNewTxs(request: api_pb.TxFilter, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Transaction>;
    public sendTransaction(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
    public sendTransaction(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
    public sendRawTransaction(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    public sendRawTransaction(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
    public sendTransactionSequence(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    public sendTransactionSequence(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
    public sendRawTransactionSequence(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    public sendRawTransactionSequence(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
    public subscribeNewBlocks(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
    public subscribeNewBlocks(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eth_pb.Block>;
}
