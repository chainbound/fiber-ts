// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var api_pb = require('./api_pb.js');
var eth_pb = require('./eth_pb.js');

function serialize_api_BackrunMsg(arg) {
  if (!(arg instanceof api_pb.BackrunMsg)) {
    throw new Error('Expected argument of type api.BackrunMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_BackrunMsg(buffer_arg) {
  return api_pb.BackrunMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_BlockFilter(arg) {
  if (!(arg instanceof api_pb.BlockFilter)) {
    throw new Error('Expected argument of type api.BlockFilter');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_BlockFilter(buffer_arg) {
  return api_pb.BlockFilter.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_RawBackrunMsg(arg) {
  if (!(arg instanceof api_pb.RawBackrunMsg)) {
    throw new Error('Expected argument of type api.RawBackrunMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_RawBackrunMsg(buffer_arg) {
  return api_pb.RawBackrunMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_RawTxMsg(arg) {
  if (!(arg instanceof api_pb.RawTxMsg)) {
    throw new Error('Expected argument of type api.RawTxMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_RawTxMsg(buffer_arg) {
  return api_pb.RawTxMsg.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_eth_Block(arg) {
  if (!(arg instanceof eth_pb.Block)) {
    throw new Error('Expected argument of type eth.Block');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eth_Block(buffer_arg) {
  return eth_pb.Block.deserializeBinary(new Uint8Array(buffer_arg));
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


var APIService = exports.APIService = {
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
  subscribeNewBlocks: {
    path: '/api.API/SubscribeNewBlocks',
    requestStream: false,
    responseStream: true,
    requestType: api_pb.BlockFilter,
    responseType: eth_pb.Block,
    requestSerialize: serialize_api_BlockFilter,
    requestDeserialize: deserialize_api_BlockFilter,
    responseSerialize: serialize_eth_Block,
    responseDeserialize: deserialize_eth_Block,
  },
  sendTransaction: {
    path: '/api.API/SendTransaction',
    requestStream: false,
    responseStream: false,
    requestType: eth_pb.Transaction,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_eth_Transaction,
    requestDeserialize: deserialize_eth_Transaction,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
  sendRawTransaction: {
    path: '/api.API/SendRawTransaction',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.RawTxMsg,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_api_RawTxMsg,
    requestDeserialize: deserialize_api_RawTxMsg,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
  // Backrun is the RPC method for backrunning a transaction.
backrun: {
    path: '/api.API/Backrun',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.BackrunMsg,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_api_BackrunMsg,
    requestDeserialize: deserialize_api_BackrunMsg,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
  rawBackrun: {
    path: '/api.API/RawBackrun',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.RawBackrunMsg,
    responseType: api_pb.TransactionResponse,
    requestSerialize: serialize_api_RawBackrunMsg,
    requestDeserialize: deserialize_api_RawBackrunMsg,
    responseSerialize: serialize_api_TransactionResponse,
    responseDeserialize: deserialize_api_TransactionResponse,
  },
};

exports.APIClient = grpc.makeGenericClientConstructor(APIService);
