// package: eth
// file: eth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as types_pb from "./types_pb";

export class BlockNumber extends jspb.Message { 

    hasLatest(): boolean;
    clearLatest(): void;
    getLatest(): google_protobuf_empty_pb.Empty | undefined;
    setLatest(value?: google_protobuf_empty_pb.Empty): BlockNumber;

    hasPending(): boolean;
    clearPending(): void;
    getPending(): google_protobuf_empty_pb.Empty | undefined;
    setPending(value?: google_protobuf_empty_pb.Empty): BlockNumber;

    hasNumber(): boolean;
    clearNumber(): void;
    getNumber(): number;
    setNumber(value: number): BlockNumber;

    getBlockNumberCase(): BlockNumber.BlockNumberCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlockNumber.AsObject;
    static toObject(includeInstance: boolean, msg: BlockNumber): BlockNumber.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlockNumber, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlockNumber;
    static deserializeBinaryFromReader(message: BlockNumber, reader: jspb.BinaryReader): BlockNumber;
}

export namespace BlockNumber {
    export type AsObject = {
        latest?: google_protobuf_empty_pb.Empty.AsObject,
        pending?: google_protobuf_empty_pb.Empty.AsObject,
        number: number,
    }

    export enum BlockNumberCase {
        BLOCK_NUMBER_NOT_SET = 0,
        LATEST = 1,
        PENDING = 2,
        NUMBER = 3,
    }

}

export class BlockId extends jspb.Message { 

    hasHash(): boolean;
    clearHash(): void;
    getHash(): types_pb.H256 | undefined;
    setHash(value?: types_pb.H256): BlockId;

    hasNumber(): boolean;
    clearNumber(): void;
    getNumber(): BlockNumber | undefined;
    setNumber(value?: BlockNumber): BlockId;

    getIdCase(): BlockId.IdCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlockId.AsObject;
    static toObject(includeInstance: boolean, msg: BlockId): BlockId.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlockId, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlockId;
    static deserializeBinaryFromReader(message: BlockId, reader: jspb.BinaryReader): BlockId;
}

export namespace BlockId {
    export type AsObject = {
        hash?: types_pb.H256.AsObject,
        number?: BlockNumber.AsObject,
    }

    export enum IdCase {
        ID_NOT_SET = 0,
        HASH = 1,
        NUMBER = 2,
    }

}

export class CanonicalTransactionData extends jspb.Message { 

    hasBlockHash(): boolean;
    clearBlockHash(): void;
    getBlockHash(): types_pb.H256 | undefined;
    setBlockHash(value?: types_pb.H256): CanonicalTransactionData;
    getBlockNumber(): number;
    setBlockNumber(value: number): CanonicalTransactionData;
    getIndex(): number;
    setIndex(value: number): CanonicalTransactionData;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CanonicalTransactionData.AsObject;
    static toObject(includeInstance: boolean, msg: CanonicalTransactionData): CanonicalTransactionData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CanonicalTransactionData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CanonicalTransactionData;
    static deserializeBinaryFromReader(message: CanonicalTransactionData, reader: jspb.BinaryReader): CanonicalTransactionData;
}

export namespace CanonicalTransactionData {
    export type AsObject = {
        blockHash?: types_pb.H256.AsObject,
        blockNumber: number,
        index: number,
    }
}

export class AccessListItem extends jspb.Message { 

    hasAddress(): boolean;
    clearAddress(): void;
    getAddress(): types_pb.H160 | undefined;
    setAddress(value?: types_pb.H160): AccessListItem;
    clearSlotsList(): void;
    getSlotsList(): Array<types_pb.H256>;
    setSlotsList(value: Array<types_pb.H256>): AccessListItem;
    addSlots(value?: types_pb.H256, index?: number): types_pb.H256;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccessListItem.AsObject;
    static toObject(includeInstance: boolean, msg: AccessListItem): AccessListItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AccessListItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AccessListItem;
    static deserializeBinaryFromReader(message: AccessListItem, reader: jspb.BinaryReader): AccessListItem;
}

export namespace AccessListItem {
    export type AsObject = {
        address?: types_pb.H160.AsObject,
        slotsList: Array<types_pb.H256.AsObject>,
    }
}

export class Transaction extends jspb.Message { 

    hasTo(): boolean;
    clearTo(): void;
    getTo(): Uint8Array | string;
    getTo_asU8(): Uint8Array;
    getTo_asB64(): string;
    setTo(value: Uint8Array | string): Transaction;
    getGas(): number;
    setGas(value: number): Transaction;
    getGasPrice(): number;
    setGasPrice(value: number): Transaction;
    getHash(): Uint8Array | string;
    getHash_asU8(): Uint8Array;
    getHash_asB64(): string;
    setHash(value: Uint8Array | string): Transaction;
    getInput(): Uint8Array | string;
    getInput_asU8(): Uint8Array;
    getInput_asB64(): string;
    setInput(value: Uint8Array | string): Transaction;
    getNonce(): number;
    setNonce(value: number): Transaction;
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): Transaction;

    hasFrom(): boolean;
    clearFrom(): void;
    getFrom(): Uint8Array | string;
    getFrom_asU8(): Uint8Array;
    getFrom_asB64(): string;
    setFrom(value: Uint8Array | string): Transaction;
    getType(): number;
    setType(value: number): Transaction;
    getMaxFee(): number;
    setMaxFee(value: number): Transaction;
    getPriorityFee(): number;
    setPriorityFee(value: number): Transaction;
    getV(): number;
    setV(value: number): Transaction;
    getR(): Uint8Array | string;
    getR_asU8(): Uint8Array;
    getR_asB64(): string;
    setR(value: Uint8Array | string): Transaction;
    getS(): Uint8Array | string;
    getS_asU8(): Uint8Array;
    getS_asB64(): string;
    setS(value: Uint8Array | string): Transaction;
    getChainid(): number;
    setChainid(value: number): Transaction;
    clearAccessListList(): void;
    getAccessListList(): Array<AccessTuple>;
    setAccessListList(value: Array<AccessTuple>): Transaction;
    addAccessList(value?: AccessTuple, index?: number): AccessTuple;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Transaction.AsObject;
    static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Transaction;
    static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
    export type AsObject = {
        to: Uint8Array | string,
        gas: number,
        gasPrice: number,
        hash: Uint8Array | string,
        input: Uint8Array | string,
        nonce: number,
        value: Uint8Array | string,
        from: Uint8Array | string,
        type: number,
        maxFee: number,
        priorityFee: number,
        v: number,
        r: Uint8Array | string,
        s: Uint8Array | string,
        chainid: number,
        accessListList: Array<AccessTuple.AsObject>,
    }
}

export class AccessTuple extends jspb.Message { 
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): AccessTuple;
    clearStorageKeysList(): void;
    getStorageKeysList(): Array<Uint8Array | string>;
    getStorageKeysList_asU8(): Array<Uint8Array>;
    getStorageKeysList_asB64(): Array<string>;
    setStorageKeysList(value: Array<Uint8Array | string>): AccessTuple;
    addStorageKeys(value: Uint8Array | string, index?: number): Uint8Array | string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AccessTuple.AsObject;
    static toObject(includeInstance: boolean, msg: AccessTuple): AccessTuple.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AccessTuple, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AccessTuple;
    static deserializeBinaryFromReader(message: AccessTuple, reader: jspb.BinaryReader): AccessTuple;
}

export namespace AccessTuple {
    export type AsObject = {
        address: Uint8Array | string,
        storageKeysList: Array<Uint8Array | string>,
    }
}

export class Block extends jspb.Message { 
    getNumber(): number;
    setNumber(value: number): Block;
    getHash(): Uint8Array | string;
    getHash_asU8(): Uint8Array;
    getHash_asB64(): string;
    setHash(value: Uint8Array | string): Block;
    getParentHash(): Uint8Array | string;
    getParentHash_asU8(): Uint8Array;
    getParentHash_asB64(): string;
    setParentHash(value: Uint8Array | string): Block;
    getPrevRandao(): Uint8Array | string;
    getPrevRandao_asU8(): Uint8Array;
    getPrevRandao_asB64(): string;
    setPrevRandao(value: Uint8Array | string): Block;
    getStateRoot(): Uint8Array | string;
    getStateRoot_asU8(): Uint8Array;
    getStateRoot_asB64(): string;
    setStateRoot(value: Uint8Array | string): Block;
    getReceiptRoot(): Uint8Array | string;
    getReceiptRoot_asU8(): Uint8Array;
    getReceiptRoot_asB64(): string;
    setReceiptRoot(value: Uint8Array | string): Block;
    getFeeRecipient(): Uint8Array | string;
    getFeeRecipient_asU8(): Uint8Array;
    getFeeRecipient_asB64(): string;
    setFeeRecipient(value: Uint8Array | string): Block;

    hasExtraData(): boolean;
    clearExtraData(): void;
    getExtraData(): Uint8Array | string;
    getExtraData_asU8(): Uint8Array;
    getExtraData_asB64(): string;
    setExtraData(value: Uint8Array | string): Block;
    getGasLimit(): number;
    setGasLimit(value: number): Block;
    getGasUsed(): number;
    setGasUsed(value: number): Block;
    getTimestamp(): number;
    setTimestamp(value: number): Block;
    getLogsBloom(): Uint8Array | string;
    getLogsBloom_asU8(): Uint8Array;
    getLogsBloom_asB64(): string;
    setLogsBloom(value: Uint8Array | string): Block;
    getBaseFeePerGas(): Uint8Array | string;
    getBaseFeePerGas_asU8(): Uint8Array;
    getBaseFeePerGas_asB64(): string;
    setBaseFeePerGas(value: Uint8Array | string): Block;
    clearTransactionsList(): void;
    getTransactionsList(): Array<Transaction>;
    setTransactionsList(value: Array<Transaction>): Block;
    addTransactions(value?: Transaction, index?: number): Transaction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Block.AsObject;
    static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Block;
    static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
    export type AsObject = {
        number: number,
        hash: Uint8Array | string,
        parentHash: Uint8Array | string,
        prevRandao: Uint8Array | string,
        stateRoot: Uint8Array | string,
        receiptRoot: Uint8Array | string,
        feeRecipient: Uint8Array | string,
        extraData: Uint8Array | string,
        gasLimit: number,
        gasUsed: number,
        timestamp: number,
        logsBloom: Uint8Array | string,
        baseFeePerGas: Uint8Array | string,
        transactionsList: Array<Transaction.AsObject>,
    }
}
