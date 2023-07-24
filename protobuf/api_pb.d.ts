// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as eth_pb from "./eth_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class TxSequenceMsg extends jspb.Message { 
    clearSequenceList(): void;
    getSequenceList(): Array<eth_pb.Transaction>;
    setSequenceList(value: Array<eth_pb.Transaction>): TxSequenceMsg;
    addSequence(value?: eth_pb.Transaction, index?: number): eth_pb.Transaction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TxSequenceMsg.AsObject;
    static toObject(includeInstance: boolean, msg: TxSequenceMsg): TxSequenceMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TxSequenceMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TxSequenceMsg;
    static deserializeBinaryFromReader(message: TxSequenceMsg, reader: jspb.BinaryReader): TxSequenceMsg;
}

export namespace TxSequenceMsg {
    export type AsObject = {
        sequenceList: Array<eth_pb.Transaction.AsObject>,
    }
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
    static toObject(includeInstance: boolean, msg: RawTxSequenceMsg): RawTxSequenceMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RawTxSequenceMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RawTxSequenceMsg;
    static deserializeBinaryFromReader(message: RawTxSequenceMsg, reader: jspb.BinaryReader): RawTxSequenceMsg;
}

export namespace RawTxSequenceMsg {
    export type AsObject = {
        rawTxsList: Array<Uint8Array | string>,
    }
}

export class TxSequenceResponse extends jspb.Message { 
    clearSequenceResponseList(): void;
    getSequenceResponseList(): Array<TransactionResponse>;
    setSequenceResponseList(value: Array<TransactionResponse>): TxSequenceResponse;
    addSequenceResponse(value?: TransactionResponse, index?: number): TransactionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TxSequenceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TxSequenceResponse): TxSequenceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TxSequenceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TxSequenceResponse;
    static deserializeBinaryFromReader(message: TxSequenceResponse, reader: jspb.BinaryReader): TxSequenceResponse;
}

export namespace TxSequenceResponse {
    export type AsObject = {
        sequenceResponseList: Array<TransactionResponse.AsObject>,
    }
}

export class TxFilter extends jspb.Message { 
    getEncoded(): Uint8Array | string;
    getEncoded_asU8(): Uint8Array;
    getEncoded_asB64(): string;
    setEncoded(value: Uint8Array | string): TxFilter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TxFilter.AsObject;
    static toObject(includeInstance: boolean, msg: TxFilter): TxFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TxFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TxFilter;
    static deserializeBinaryFromReader(message: TxFilter, reader: jspb.BinaryReader): TxFilter;
}

export namespace TxFilter {
    export type AsObject = {
        encoded: Uint8Array | string,
    }
}

export class BlockFilter extends jspb.Message { 
    getProducer(): string;
    setProducer(value: string): BlockFilter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlockFilter.AsObject;
    static toObject(includeInstance: boolean, msg: BlockFilter): BlockFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlockFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlockFilter;
    static deserializeBinaryFromReader(message: BlockFilter, reader: jspb.BinaryReader): BlockFilter;
}

export namespace BlockFilter {
    export type AsObject = {
        producer: string,
    }
}

export class RawTxMsg extends jspb.Message { 
    getRawtx(): Uint8Array | string;
    getRawtx_asU8(): Uint8Array;
    getRawtx_asB64(): string;
    setRawtx(value: Uint8Array | string): RawTxMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RawTxMsg.AsObject;
    static toObject(includeInstance: boolean, msg: RawTxMsg): RawTxMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RawTxMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RawTxMsg;
    static deserializeBinaryFromReader(message: RawTxMsg, reader: jspb.BinaryReader): RawTxMsg;
}

export namespace RawTxMsg {
    export type AsObject = {
        rawtx: Uint8Array | string,
    }
}

export class TransactionResponse extends jspb.Message { 
    getHash(): string;
    setHash(value: string): TransactionResponse;
    getTimestamp(): number;
    setTimestamp(value: number): TransactionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TransactionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TransactionResponse): TransactionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TransactionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TransactionResponse;
    static deserializeBinaryFromReader(message: TransactionResponse, reader: jspb.BinaryReader): TransactionResponse;
}

export namespace TransactionResponse {
    export type AsObject = {
        hash: string,
        timestamp: number,
    }
}

export class BackrunMsg extends jspb.Message { 
    getHash(): string;
    setHash(value: string): BackrunMsg;

    hasTx(): boolean;
    clearTx(): void;
    getTx(): eth_pb.Transaction | undefined;
    setTx(value?: eth_pb.Transaction): BackrunMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BackrunMsg.AsObject;
    static toObject(includeInstance: boolean, msg: BackrunMsg): BackrunMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BackrunMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BackrunMsg;
    static deserializeBinaryFromReader(message: BackrunMsg, reader: jspb.BinaryReader): BackrunMsg;
}

export namespace BackrunMsg {
    export type AsObject = {
        hash: string,
        tx?: eth_pb.Transaction.AsObject,
    }
}

export class RawBackrunMsg extends jspb.Message { 
    getHash(): string;
    setHash(value: string): RawBackrunMsg;
    getRawtx(): Uint8Array | string;
    getRawtx_asU8(): Uint8Array;
    getRawtx_asB64(): string;
    setRawtx(value: Uint8Array | string): RawBackrunMsg;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RawBackrunMsg.AsObject;
    static toObject(includeInstance: boolean, msg: RawBackrunMsg): RawBackrunMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RawBackrunMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RawBackrunMsg;
    static deserializeBinaryFromReader(message: RawBackrunMsg, reader: jspb.BinaryReader): RawBackrunMsg;
}

export namespace RawBackrunMsg {
    export type AsObject = {
        hash: string,
        rawtx: Uint8Array | string,
    }
}
