// package: api
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as eth_pb from "./eth_pb";

export class TxFilter extends jspb.Message { 
    getFrom(): string;
    setFrom(value: string): TxFilter;
    getTo(): string;
    setTo(value: string): TxFilter;
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): TxFilter;

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
        from: string,
        to: string,
        value: Uint8Array | string,
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
