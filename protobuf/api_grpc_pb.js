// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var api_pb = require('./api_pb.js');
var eth_pb = require('./eth_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_api_RawTxMsg(arg) {
  if (!(arg instanceof api_pb.RawTxMsg)) {
    throw new Error('Expected argument of type api.RawTxMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_RawTxMsg(buffer_arg) {
  return api_pb.RawTxMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_RawTxSequenceMsg(arg) {
  if (!(arg instanceof api_pb.RawTxSequenceMsg)) {
    throw new Error('Expected argument of type api.RawTxSequenceMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_RawTxSequenceMsg(buffer_arg) {
  return api_pb.RawTxSequenceMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TransactionResponse(arg) {
  if (!(arg instanceof api_pb.TransactionResponse)) {
    throw new Error('Expected argument of type api.TransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TransactionResponse(buffer_arg) {
  return api_pb.TransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TxFilter(arg) {
  if (!(arg instanceof api_pb.TxFilter)) {
    throw new Error('Expected argument of type api.TxFilter');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TxFilter(buffer_arg) {
  return api_pb.TxFilter.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TxSequenceMsg(arg) {
  if (!(arg instanceof api_pb.TxSequenceMsg)) {
    throw new Error('Expected argument of type api.TxSequenceMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TxSequenceMsg(buffer_arg) {
  return api_pb.TxSequenceMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TxSequenceResponse(arg) {
  if (!(arg instanceof api_pb.TxSequenceResponse)) {
    throw new Error('Expected argument of type api.TxSequenceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TxSequenceResponse(buffer_arg) {
  return api_pb.TxSequenceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eth_CompactBeaconBlock(arg) {
  if (!(arg instanceof eth_pb.CompactBeaconBlock)) {
    throw new Error('Expected argument of type eth.CompactBeaconBlock');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eth_CompactBeaconBlock(buffer_arg) {
  return eth_pb.CompactBeaconBlock.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eth_ExecutionPayload(arg) {
  if (!(arg instanceof eth_pb.ExecutionPayload)) {
    throw new Error('Expected argument of type eth.ExecutionPayload');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eth_ExecutionPayload(buffer_arg) {
  return eth_pb.ExecutionPayload.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eth_ExecutionPayloadHeader(arg) {
  if (!(arg instanceof eth_pb.ExecutionPayloadHeader)) {
    throw new Error('Expected argument of type eth.ExecutionPayloadHeader');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eth_ExecutionPayloadHeader(buffer_arg) {
  return eth_pb.ExecutionPayloadHeader.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eth_Transaction(arg) {
  if (!(arg instanceof eth_pb.Transaction)) {
    throw new Error('Expected argument of type eth.Transaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eth_Transaction(buffer_arg) {
  return eth_pb.Transaction.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var APIService = exports.APIService = {
  // Opens a new transaction stream with the given filter.
subscribeNewTxs: {
    path: '/api.API/SubscribeNewTxs',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.TxFilter,
    responseType: eth_pb.Transaction,
    requestSerialize: serialize_api_TxFilter,
    requestDeserialize: deserialize_api_TxFilter,
    responseSerialize: serialize_eth_Transaction,
    responseDeserialize: deserialize_eth_Transaction,
  },
  // Sends a signed transaction to the network.
sendTransaction: {
    path: '/api.API/SendTransaction',
    requestStream: true,
    responseStream: true,
    requestType: eth_pb.Transaction,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_eth_Transaction,
    requestDeserialize: deserialize_eth_Transaction,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
  // Sends a signed, RLP encoded transaction to the network
sendRawTransaction: {
    path: '/api.API/SendRawTransaction',
    requestStream: true,
    responseStream: true,
    requestType: api_pb.RawTxMsg,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_api_RawTxMsg,
    requestDeserialize: deserialize_api_RawTxMsg,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
  // Sends a sequence of signed transactions to the network.
sendTransactionSequence: {
    path: '/api.API/SendTransactionSequence',
    requestStream: true,
    responseStream: true,
    requestType: api_pb.TxSequenceMsg,
    responseType: api_pb.TxSequenceResponse,
    requestSerialize: serialize_api_TxSequenceMsg,
    requestDeserialize: deserialize_api_TxSequenceMsg,
    responseSerialize: serialize_api_TxSequenceResponse,
    responseDeserialize: deserialize_api_TxSequenceResponse,
  },
  // Sends a sequence of signed, RLP encoded transactions to the network.
sendRawTransactionSequence: {
    path: '/api.API/SendRawTransactionSequence',
    requestStream: true,
    responseStream: true,
    requestType: api_pb.RawTxSequenceMsg,
    responseType: api_pb.TxSequenceResponse,
    requestSerialize: serialize_api_RawTxSequenceMsg,
    requestDeserialize: deserialize_api_RawTxSequenceMsg,
    responseSerialize: serialize_api_TxSequenceResponse,
    responseDeserialize: deserialize_api_TxSequenceResponse,
  },
  // Opens a stream of new execution payloads.
subscribeExecutionPayloads: {
    path: '/api.API/SubscribeExecutionPayloads',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: eth_pb.ExecutionPayload,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_eth_ExecutionPayload,
    responseDeserialize: deserialize_eth_ExecutionPayload,
  },
  // Opens a stream of new execution payload headers.
subscribeExecutionHeaders: {
    path: '/api.API/SubscribeExecutionHeaders',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: eth_pb.ExecutionPayloadHeader,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_eth_ExecutionPayloadHeader,
    responseDeserialize: deserialize_eth_ExecutionPayloadHeader,
  },
  // Opens a stream of new beacon blocks. The beacon blocks are "compacted", meaning that the
// execution payload is not included.
subscribeBeaconBlocks: {
    path: '/api.API/SubscribeBeaconBlocks',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: eth_pb.CompactBeaconBlock,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_eth_CompactBeaconBlock,
    responseDeserialize: deserialize_eth_CompactBeaconBlock,
  },
};

exports.APIClient = grpc.makeGenericClientConstructor(APIService);
