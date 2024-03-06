// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as api_pb from "./api_pb.d.cts";
import * as eth_pb from "./eth_pb.d.cts";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IAPIService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  subscribeNewTxs: IAPIService_ISubscribeNewTxs;
  subscribeNewTxsV2: IAPIService_ISubscribeNewTxsV2;
  subscribeNewBlobTxs: IAPIService_ISubscribeNewBlobTxs;
  sendTransaction: IAPIService_ISendTransaction;
  sendRawTransaction: IAPIService_ISendRawTransaction;
  sendTransactionV2: IAPIService_ISendTransactionV2;
  sendTransactionSequence: IAPIService_ISendTransactionSequence;
  sendTransactionSequenceV2: IAPIService_ISendTransactionSequenceV2;
  sendRawTransactionSequence: IAPIService_ISendRawTransactionSequence;
  subscribeExecutionPayloads: IAPIService_ISubscribeExecutionPayloads;
  subscribeExecutionPayloadsV2: IAPIService_ISubscribeExecutionPayloadsV2;
  subscribeExecutionHeaders: IAPIService_ISubscribeExecutionHeaders;
  subscribeBeaconBlocks: IAPIService_ISubscribeBeaconBlocks;
  subscribeBeaconBlocksV2: IAPIService_ISubscribeBeaconBlocksV2;
  submitBlockStream: IAPIService_ISubmitBlockStream;
}

interface IAPIService_ISubscribeNewTxs
  extends grpc.MethodDefinition<api_pb.TxFilter, eth_pb.Transaction> {
  path: "/api.API/SubscribeNewTxs";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.TxFilter>;
  requestDeserialize: grpc.deserialize<api_pb.TxFilter>;
  responseSerialize: grpc.serialize<eth_pb.Transaction>;
  responseDeserialize: grpc.deserialize<eth_pb.Transaction>;
}
interface IAPIService_ISubscribeNewTxsV2
  extends grpc.MethodDefinition<api_pb.TxFilter, api_pb.TransactionWithSenderMsg> {
  path: "/api.API/SubscribeNewTxsV2";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.TxFilter>;
  requestDeserialize: grpc.deserialize<api_pb.TxFilter>;
  responseSerialize: grpc.serialize<api_pb.TransactionWithSenderMsg>;
  responseDeserialize: grpc.deserialize<api_pb.TransactionWithSenderMsg>;
}
interface IAPIService_ISubscribeNewBlobTxs
  extends grpc.MethodDefinition<
    google_protobuf_empty_pb.Empty,
    api_pb.TransactionWithSenderMsg
  > {
  path: "/api.API/SubscribeNewBlobTxs";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<api_pb.TransactionWithSenderMsg>;
  responseDeserialize: grpc.deserialize<api_pb.TransactionWithSenderMsg>;
}
interface IAPIService_ISendTransaction
  extends grpc.MethodDefinition<eth_pb.Transaction, api_pb.TransactionResponse> {
  path: "/api.API/SendTransaction";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<eth_pb.Transaction>;
  requestDeserialize: grpc.deserialize<eth_pb.Transaction>;
  responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_ISendRawTransaction
  extends grpc.MethodDefinition<api_pb.RawTxMsg, api_pb.TransactionResponse> {
  path: "/api.API/SendRawTransaction";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.RawTxMsg>;
  requestDeserialize: grpc.deserialize<api_pb.RawTxMsg>;
  responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_ISendTransactionV2
  extends grpc.MethodDefinition<api_pb.TransactionMsg, api_pb.TransactionResponse> {
  path: "/api.API/SendTransactionV2";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.TransactionMsg>;
  requestDeserialize: grpc.deserialize<api_pb.TransactionMsg>;
  responseSerialize: grpc.serialize<api_pb.TransactionResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TransactionResponse>;
}
interface IAPIService_ISendTransactionSequence
  extends grpc.MethodDefinition<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse> {
  path: "/api.API/SendTransactionSequence";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.TxSequenceMsg>;
  requestDeserialize: grpc.deserialize<api_pb.TxSequenceMsg>;
  responseSerialize: grpc.serialize<api_pb.TxSequenceResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TxSequenceResponse>;
}
interface IAPIService_ISendTransactionSequenceV2
  extends grpc.MethodDefinition<api_pb.TxSequenceMsgV2, api_pb.TxSequenceResponse> {
  path: "/api.API/SendTransactionSequenceV2";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.TxSequenceMsgV2>;
  requestDeserialize: grpc.deserialize<api_pb.TxSequenceMsgV2>;
  responseSerialize: grpc.serialize<api_pb.TxSequenceResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TxSequenceResponse>;
}
interface IAPIService_ISendRawTransactionSequence
  extends grpc.MethodDefinition<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse> {
  path: "/api.API/SendRawTransactionSequence";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.RawTxSequenceMsg>;
  requestDeserialize: grpc.deserialize<api_pb.RawTxSequenceMsg>;
  responseSerialize: grpc.serialize<api_pb.TxSequenceResponse>;
  responseDeserialize: grpc.deserialize<api_pb.TxSequenceResponse>;
}
interface IAPIService_ISubscribeExecutionPayloads
  extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, eth_pb.ExecutionPayload> {
  path: "/api.API/SubscribeExecutionPayloads";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<eth_pb.ExecutionPayload>;
  responseDeserialize: grpc.deserialize<eth_pb.ExecutionPayload>;
}
interface IAPIService_ISubscribeExecutionPayloadsV2
  extends grpc.MethodDefinition<
    google_protobuf_empty_pb.Empty,
    api_pb.ExecutionPayloadMsg
  > {
  path: "/api.API/SubscribeExecutionPayloadsV2";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<api_pb.ExecutionPayloadMsg>;
  responseDeserialize: grpc.deserialize<api_pb.ExecutionPayloadMsg>;
}
interface IAPIService_ISubscribeExecutionHeaders
  extends grpc.MethodDefinition<
    google_protobuf_empty_pb.Empty,
    eth_pb.ExecutionPayloadHeader
  > {
  path: "/api.API/SubscribeExecutionHeaders";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<eth_pb.ExecutionPayloadHeader>;
  responseDeserialize: grpc.deserialize<eth_pb.ExecutionPayloadHeader>;
}
interface IAPIService_ISubscribeBeaconBlocks
  extends grpc.MethodDefinition<
    google_protobuf_empty_pb.Empty,
    eth_pb.CompactBeaconBlock
  > {
  path: "/api.API/SubscribeBeaconBlocks";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<eth_pb.CompactBeaconBlock>;
  responseDeserialize: grpc.deserialize<eth_pb.CompactBeaconBlock>;
}
interface IAPIService_ISubscribeBeaconBlocksV2
  extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, api_pb.BeaconBlockMsg> {
  path: "/api.API/SubscribeBeaconBlocksV2";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
  requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
  responseSerialize: grpc.serialize<api_pb.BeaconBlockMsg>;
  responseDeserialize: grpc.deserialize<api_pb.BeaconBlockMsg>;
}
interface IAPIService_ISubmitBlockStream
  extends grpc.MethodDefinition<
    api_pb.BlockSubmissionMsg,
    api_pb.BlockSubmissionResponse
  > {
  path: "/api.API/SubmitBlockStream";
  requestStream: true;
  responseStream: true;
  requestSerialize: grpc.serialize<api_pb.BlockSubmissionMsg>;
  requestDeserialize: grpc.deserialize<api_pb.BlockSubmissionMsg>;
  responseSerialize: grpc.serialize<api_pb.BlockSubmissionResponse>;
  responseDeserialize: grpc.deserialize<api_pb.BlockSubmissionResponse>;
}

export const APIService: IAPIService;

export interface IAPIServer extends grpc.UntypedServiceImplementation {
  subscribeNewTxs: grpc.handleServerStreamingCall<api_pb.TxFilter, eth_pb.Transaction>;
  subscribeNewTxsV2: grpc.handleServerStreamingCall<
    api_pb.TxFilter,
    api_pb.TransactionWithSenderMsg
  >;
  subscribeNewBlobTxs: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    api_pb.TransactionWithSenderMsg
  >;
  sendTransaction: grpc.handleBidiStreamingCall<
    eth_pb.Transaction,
    api_pb.TransactionResponse
  >;
  sendRawTransaction: grpc.handleBidiStreamingCall<
    api_pb.RawTxMsg,
    api_pb.TransactionResponse
  >;
  sendTransactionV2: grpc.handleBidiStreamingCall<
    api_pb.TransactionMsg,
    api_pb.TransactionResponse
  >;
  sendTransactionSequence: grpc.handleBidiStreamingCall<
    api_pb.TxSequenceMsg,
    api_pb.TxSequenceResponse
  >;
  sendTransactionSequenceV2: grpc.handleBidiStreamingCall<
    api_pb.TxSequenceMsgV2,
    api_pb.TxSequenceResponse
  >;
  sendRawTransactionSequence: grpc.handleBidiStreamingCall<
    api_pb.RawTxSequenceMsg,
    api_pb.TxSequenceResponse
  >;
  subscribeExecutionPayloads: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    eth_pb.ExecutionPayload
  >;
  subscribeExecutionPayloadsV2: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    api_pb.ExecutionPayloadMsg
  >;
  subscribeExecutionHeaders: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    eth_pb.ExecutionPayloadHeader
  >;
  subscribeBeaconBlocks: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    eth_pb.CompactBeaconBlock
  >;
  subscribeBeaconBlocksV2: grpc.handleServerStreamingCall<
    google_protobuf_empty_pb.Empty,
    api_pb.BeaconBlockMsg
  >;
  submitBlockStream: grpc.handleBidiStreamingCall<
    api_pb.BlockSubmissionMsg,
    api_pb.BlockSubmissionResponse
  >;
}

export interface IAPIClient {
  subscribeNewTxs(
    request: api_pb.TxFilter,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.Transaction>;
  subscribeNewTxs(
    request: api_pb.TxFilter,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.Transaction>;
  subscribeNewTxsV2(
    request: api_pb.TxFilter,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  subscribeNewTxsV2(
    request: api_pb.TxFilter,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  subscribeNewBlobTxs(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  subscribeNewBlobTxs(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  sendTransaction(): grpc.ClientDuplexStream<
    eth_pb.Transaction,
    api_pb.TransactionResponse
  >;
  sendTransaction(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
  sendTransaction(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
  sendRawTransaction(): grpc.ClientDuplexStream<
    api_pb.RawTxMsg,
    api_pb.TransactionResponse
  >;
  sendRawTransaction(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
  sendRawTransaction(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
  sendTransactionV2(): grpc.ClientDuplexStream<
    api_pb.TransactionMsg,
    api_pb.TransactionResponse
  >;
  sendTransactionV2(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TransactionMsg, api_pb.TransactionResponse>;
  sendTransactionV2(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TransactionMsg, api_pb.TransactionResponse>;
  sendTransactionSequence(): grpc.ClientDuplexStream<
    api_pb.TxSequenceMsg,
    api_pb.TxSequenceResponse
  >;
  sendTransactionSequence(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
  sendTransactionSequence(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
  sendTransactionSequenceV2(): grpc.ClientDuplexStream<
    api_pb.TxSequenceMsgV2,
    api_pb.TxSequenceResponse
  >;
  sendTransactionSequenceV2(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsgV2, api_pb.TxSequenceResponse>;
  sendTransactionSequenceV2(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsgV2, api_pb.TxSequenceResponse>;
  sendRawTransactionSequence(): grpc.ClientDuplexStream<
    api_pb.RawTxSequenceMsg,
    api_pb.TxSequenceResponse
  >;
  sendRawTransactionSequence(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
  sendRawTransactionSequence(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
  subscribeExecutionPayloads(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayload>;
  subscribeExecutionPayloads(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayload>;
  subscribeExecutionPayloadsV2(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.ExecutionPayloadMsg>;
  subscribeExecutionPayloadsV2(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.ExecutionPayloadMsg>;
  subscribeExecutionHeaders(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayloadHeader>;
  subscribeExecutionHeaders(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayloadHeader>;
  subscribeBeaconBlocks(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.CompactBeaconBlock>;
  subscribeBeaconBlocks(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.CompactBeaconBlock>;
  subscribeBeaconBlocksV2(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.BeaconBlockMsg>;
  subscribeBeaconBlocksV2(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.BeaconBlockMsg>;
  submitBlockStream(): grpc.ClientDuplexStream<
    api_pb.BlockSubmissionMsg,
    api_pb.BlockSubmissionResponse
  >;
  submitBlockStream(
    options: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.BlockSubmissionMsg, api_pb.BlockSubmissionResponse>;
  submitBlockStream(
    metadata: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.BlockSubmissionMsg, api_pb.BlockSubmissionResponse>;
}

export class APIClient extends grpc.Client implements IAPIClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  );
  public subscribeNewTxs(
    request: api_pb.TxFilter,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.Transaction>;
  public subscribeNewTxs(
    request: api_pb.TxFilter,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.Transaction>;
  public subscribeNewTxsV2(
    request: api_pb.TxFilter,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  public subscribeNewTxsV2(
    request: api_pb.TxFilter,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  public subscribeNewBlobTxs(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  public subscribeNewBlobTxs(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.TransactionWithSenderMsg>;
  public sendTransaction(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
  public sendTransaction(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<eth_pb.Transaction, api_pb.TransactionResponse>;
  public sendRawTransaction(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
  public sendRawTransaction(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxMsg, api_pb.TransactionResponse>;
  public sendTransactionV2(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TransactionMsg, api_pb.TransactionResponse>;
  public sendTransactionV2(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TransactionMsg, api_pb.TransactionResponse>;
  public sendTransactionSequence(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
  public sendTransactionSequence(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsg, api_pb.TxSequenceResponse>;
  public sendTransactionSequenceV2(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsgV2, api_pb.TxSequenceResponse>;
  public sendTransactionSequenceV2(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.TxSequenceMsgV2, api_pb.TxSequenceResponse>;
  public sendRawTransactionSequence(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
  public sendRawTransactionSequence(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.RawTxSequenceMsg, api_pb.TxSequenceResponse>;
  public subscribeExecutionPayloads(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayload>;
  public subscribeExecutionPayloads(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayload>;
  public subscribeExecutionPayloadsV2(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.ExecutionPayloadMsg>;
  public subscribeExecutionPayloadsV2(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.ExecutionPayloadMsg>;
  public subscribeExecutionHeaders(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayloadHeader>;
  public subscribeExecutionHeaders(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.ExecutionPayloadHeader>;
  public subscribeBeaconBlocks(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.CompactBeaconBlock>;
  public subscribeBeaconBlocks(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<eth_pb.CompactBeaconBlock>;
  public subscribeBeaconBlocksV2(
    request: google_protobuf_empty_pb.Empty,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.BeaconBlockMsg>;
  public subscribeBeaconBlocksV2(
    request: google_protobuf_empty_pb.Empty,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<api_pb.BeaconBlockMsg>;
  public submitBlockStream(
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.BlockSubmissionMsg, api_pb.BlockSubmissionResponse>;
  public submitBlockStream(
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientDuplexStream<api_pb.BlockSubmissionMsg, api_pb.BlockSubmissionResponse>;
}
