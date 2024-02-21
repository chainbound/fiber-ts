// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as eth_pb from "./eth_pb.d.cts";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class TxSequenceMsg extends jspb.Message {
  clearSequenceList(): void;
  getSequenceList(): Array<eth_pb.Transaction>;
  setSequenceList(value: Array<eth_pb.Transaction>): TxSequenceMsg;
  addSequence(value?: eth_pb.Transaction, index?: number): eth_pb.Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxSequenceMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TxSequenceMsg,
  ): TxSequenceMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TxSequenceMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TxSequenceMsg;
  static deserializeBinaryFromReader(
    message: TxSequenceMsg,
    reader: jspb.BinaryReader,
  ): TxSequenceMsg;
}

export namespace TxSequenceMsg {
  export type AsObject = {
    sequenceList: Array<eth_pb.Transaction.AsObject>;
  };
}

export class TxSequenceMsgV2 extends jspb.Message {
  clearSequenceList(): void;
  getSequenceList(): Array<Uint8Array | string>;
  getSequenceList_asU8(): Array<Uint8Array>;
  getSequenceList_asB64(): Array<string>;
  setSequenceList(value: Array<Uint8Array | string>): TxSequenceMsgV2;
  addSequence(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxSequenceMsgV2.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TxSequenceMsgV2,
  ): TxSequenceMsgV2.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TxSequenceMsgV2,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TxSequenceMsgV2;
  static deserializeBinaryFromReader(
    message: TxSequenceMsgV2,
    reader: jspb.BinaryReader,
  ): TxSequenceMsgV2;
}

export namespace TxSequenceMsgV2 {
  export type AsObject = {
    sequenceList: Array<Uint8Array | string>;
  };
}

export class RawTxSequenceMsg extends jspb.Message {
  clearRawTxsList(): void;
  getRawTxsList(): Array<Uint8Array | string>;
  getRawTxsList_asU8(): Array<Uint8Array>;
  getRawTxsList_asB64(): Array<string>;
  setRawTxsList(value: Array<Uint8Array | string>): RawTxSequenceMsg;
  addRawTxs(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RawTxSequenceMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RawTxSequenceMsg,
  ): RawTxSequenceMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RawTxSequenceMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RawTxSequenceMsg;
  static deserializeBinaryFromReader(
    message: RawTxSequenceMsg,
    reader: jspb.BinaryReader,
  ): RawTxSequenceMsg;
}

export namespace RawTxSequenceMsg {
  export type AsObject = {
    rawTxsList: Array<Uint8Array | string>;
  };
}

export class TxSequenceResponse extends jspb.Message {
  clearSequenceResponseList(): void;
  getSequenceResponseList(): Array<TransactionResponse>;
  setSequenceResponseList(
    value: Array<TransactionResponse>,
  ): TxSequenceResponse;
  addSequenceResponse(
    value?: TransactionResponse,
    index?: number,
  ): TransactionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxSequenceResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TxSequenceResponse,
  ): TxSequenceResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TxSequenceResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TxSequenceResponse;
  static deserializeBinaryFromReader(
    message: TxSequenceResponse,
    reader: jspb.BinaryReader,
  ): TxSequenceResponse;
}

export namespace TxSequenceResponse {
  export type AsObject = {
    sequenceResponseList: Array<TransactionResponse.AsObject>;
  };
}

export class TxFilter extends jspb.Message {
  getEncoded(): Uint8Array | string;
  getEncoded_asU8(): Uint8Array;
  getEncoded_asB64(): string;
  setEncoded(value: Uint8Array | string): TxFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxFilter.AsObject;
  static toObject(includeInstance: boolean, msg: TxFilter): TxFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TxFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TxFilter;
  static deserializeBinaryFromReader(
    message: TxFilter,
    reader: jspb.BinaryReader,
  ): TxFilter;
}

export namespace TxFilter {
  export type AsObject = {
    encoded: Uint8Array | string;
  };
}

export class BlockFilter extends jspb.Message {
  getProducer(): string;
  setProducer(value: string): BlockFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockFilter.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BlockFilter,
  ): BlockFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BlockFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BlockFilter;
  static deserializeBinaryFromReader(
    message: BlockFilter,
    reader: jspb.BinaryReader,
  ): BlockFilter;
}

export namespace BlockFilter {
  export type AsObject = {
    producer: string;
  };
}

export class RawTxMsg extends jspb.Message {
  getRawtx(): Uint8Array | string;
  getRawtx_asU8(): Uint8Array;
  getRawtx_asB64(): string;
  setRawtx(value: Uint8Array | string): RawTxMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RawTxMsg.AsObject;
  static toObject(includeInstance: boolean, msg: RawTxMsg): RawTxMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RawTxMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RawTxMsg;
  static deserializeBinaryFromReader(
    message: RawTxMsg,
    reader: jspb.BinaryReader,
  ): RawTxMsg;
}

export namespace RawTxMsg {
  export type AsObject = {
    rawtx: Uint8Array | string;
  };
}

export class BlockSubmissionMsg extends jspb.Message {
  getSszBlock(): Uint8Array | string;
  getSszBlock_asU8(): Uint8Array;
  getSszBlock_asB64(): string;
  setSszBlock(value: Uint8Array | string): BlockSubmissionMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockSubmissionMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BlockSubmissionMsg,
  ): BlockSubmissionMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BlockSubmissionMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BlockSubmissionMsg;
  static deserializeBinaryFromReader(
    message: BlockSubmissionMsg,
    reader: jspb.BinaryReader,
  ): BlockSubmissionMsg;
}

export namespace BlockSubmissionMsg {
  export type AsObject = {
    sszBlock: Uint8Array | string;
  };
}

export class TransactionMsg extends jspb.Message {
  getRlpTransaction(): Uint8Array | string;
  getRlpTransaction_asU8(): Uint8Array;
  getRlpTransaction_asB64(): string;
  setRlpTransaction(value: Uint8Array | string): TransactionMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TransactionMsg,
  ): TransactionMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TransactionMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TransactionMsg;
  static deserializeBinaryFromReader(
    message: TransactionMsg,
    reader: jspb.BinaryReader,
  ): TransactionMsg;
}

export namespace TransactionMsg {
  export type AsObject = {
    rlpTransaction: Uint8Array | string;
  };
}

export class TransactionWithSenderMsg extends jspb.Message {
  getRlpTransaction(): Uint8Array | string;
  getRlpTransaction_asU8(): Uint8Array;
  getRlpTransaction_asB64(): string;
  setRlpTransaction(value: Uint8Array | string): TransactionWithSenderMsg;
  getSender(): Uint8Array | string;
  getSender_asU8(): Uint8Array;
  getSender_asB64(): string;
  setSender(value: Uint8Array | string): TransactionWithSenderMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionWithSenderMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TransactionWithSenderMsg,
  ): TransactionWithSenderMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TransactionWithSenderMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TransactionWithSenderMsg;
  static deserializeBinaryFromReader(
    message: TransactionWithSenderMsg,
    reader: jspb.BinaryReader,
  ): TransactionWithSenderMsg;
}

export namespace TransactionWithSenderMsg {
  export type AsObject = {
    rlpTransaction: Uint8Array | string;
    sender: Uint8Array | string;
  };
}

export class ExecutionPayloadMsg extends jspb.Message {
  getDataVersion(): number;
  setDataVersion(value: number): ExecutionPayloadMsg;
  getSszPayload(): Uint8Array | string;
  getSszPayload_asU8(): Uint8Array;
  getSszPayload_asB64(): string;
  setSszPayload(value: Uint8Array | string): ExecutionPayloadMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionPayloadMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ExecutionPayloadMsg,
  ): ExecutionPayloadMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ExecutionPayloadMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionPayloadMsg;
  static deserializeBinaryFromReader(
    message: ExecutionPayloadMsg,
    reader: jspb.BinaryReader,
  ): ExecutionPayloadMsg;
}

export namespace ExecutionPayloadMsg {
  export type AsObject = {
    dataVersion: number;
    sszPayload: Uint8Array | string;
  };
}

export class BeaconBlockMsg extends jspb.Message {
  getDataVersion(): number;
  setDataVersion(value: number): BeaconBlockMsg;
  getSszBlock(): Uint8Array | string;
  getSszBlock_asU8(): Uint8Array;
  getSszBlock_asB64(): string;
  setSszBlock(value: Uint8Array | string): BeaconBlockMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconBlockMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BeaconBlockMsg,
  ): BeaconBlockMsg.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BeaconBlockMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BeaconBlockMsg;
  static deserializeBinaryFromReader(
    message: BeaconBlockMsg,
    reader: jspb.BinaryReader,
  ): BeaconBlockMsg;
}

export namespace BeaconBlockMsg {
  export type AsObject = {
    dataVersion: number;
    sszBlock: Uint8Array | string;
  };
}

export class BlockSubmissionResponse extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): BlockSubmissionResponse;
  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): BlockSubmissionResponse;
  getTimestamp(): number;
  setTimestamp(value: number): BlockSubmissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockSubmissionResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BlockSubmissionResponse,
  ): BlockSubmissionResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BlockSubmissionResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BlockSubmissionResponse;
  static deserializeBinaryFromReader(
    message: BlockSubmissionResponse,
    reader: jspb.BinaryReader,
  ): BlockSubmissionResponse;
}

export namespace BlockSubmissionResponse {
  export type AsObject = {
    slot: number;
    stateRoot: Uint8Array | string;
    timestamp: number;
  };
}

export class TransactionResponse extends jspb.Message {
  getHash(): string;
  setHash(value: string): TransactionResponse;
  getTimestamp(): number;
  setTimestamp(value: number): TransactionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TransactionResponse,
  ): TransactionResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TransactionResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TransactionResponse;
  static deserializeBinaryFromReader(
    message: TransactionResponse,
    reader: jspb.BinaryReader,
  ): TransactionResponse;
}

export namespace TransactionResponse {
  export type AsObject = {
    hash: string;
    timestamp: number;
  };
}
