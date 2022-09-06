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
    }
}

export class StoredTransaction extends jspb.Message { 

    hasCanonicalData(): boolean;
    clearCanonicalData(): void;
    getCanonicalData(): CanonicalTransactionData | undefined;
    setCanonicalData(value?: CanonicalTransactionData): StoredTransaction;

    hasTransaction(): boolean;
    clearTransaction(): void;
    getTransaction(): Transaction | undefined;
    setTransaction(value?: Transaction): StoredTransaction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StoredTransaction.AsObject;
    static toObject(includeInstance: boolean, msg: StoredTransaction): StoredTransaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StoredTransaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StoredTransaction;
    static deserializeBinaryFromReader(message: StoredTransaction, reader: jspb.BinaryReader): StoredTransaction;
}

export namespace StoredTransaction {
    export type AsObject = {
        canonicalData?: CanonicalTransactionData.AsObject,
        transaction?: Transaction.AsObject,
    }
}

export class Header extends jspb.Message { 
    getNumber(): number;
    setNumber(value: number): Header;
    getHash(): Uint8Array | string;
    getHash_asU8(): Uint8Array;
    getHash_asB64(): string;
    setHash(value: Uint8Array | string): Header;
    getParentHash(): Uint8Array | string;
    getParentHash_asU8(): Uint8Array;
    getParentHash_asB64(): string;
    setParentHash(value: Uint8Array | string): Header;
    getNonce(): number;
    setNonce(value: number): Header;
    getUncleHash(): Uint8Array | string;
    getUncleHash_asU8(): Uint8Array;
    getUncleHash_asB64(): string;
    setUncleHash(value: Uint8Array | string): Header;
    getStateRoot(): Uint8Array | string;
    getStateRoot_asU8(): Uint8Array;
    getStateRoot_asB64(): string;
    setStateRoot(value: Uint8Array | string): Header;
    getReceiptRoot(): Uint8Array | string;
    getReceiptRoot_asU8(): Uint8Array;
    getReceiptRoot_asB64(): string;
    setReceiptRoot(value: Uint8Array | string): Header;
    getCoinbase(): Uint8Array | string;
    getCoinbase_asU8(): Uint8Array;
    getCoinbase_asB64(): string;
    setCoinbase(value: Uint8Array | string): Header;
    getDifficulty(): number;
    setDifficulty(value: number): Header;

    hasTotalDifficulty(): boolean;
    clearTotalDifficulty(): void;
    getTotalDifficulty(): number | undefined;
    setTotalDifficulty(value: number): Header;

    hasExtraData(): boolean;
    clearExtraData(): void;
    getExtraData(): Uint8Array | string;
    getExtraData_asU8(): Uint8Array;
    getExtraData_asB64(): string;
    setExtraData(value: Uint8Array | string): Header;

    hasSize(): boolean;
    clearSize(): void;
    getSize(): number | undefined;
    setSize(value: number): Header;
    getGasLimit(): number;
    setGasLimit(value: number): Header;
    getGasUsed(): number;
    setGasUsed(value: number): Header;
    getTimestamp(): number;
    setTimestamp(value: number): Header;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Header.AsObject;
    static toObject(includeInstance: boolean, msg: Header): Header.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Header, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Header;
    static deserializeBinaryFromReader(message: Header, reader: jspb.BinaryReader): Header;
}

export namespace Header {
    export type AsObject = {
        number: number,
        hash: Uint8Array | string,
        parentHash: Uint8Array | string,
        nonce: number,
        uncleHash: Uint8Array | string,
        stateRoot: Uint8Array | string,
        receiptRoot: Uint8Array | string,
        coinbase: Uint8Array | string,
        difficulty: number,
        totalDifficulty?: number,
        extraData: Uint8Array | string,
        size?: number,
        gasLimit: number,
        gasUsed: number,
        timestamp: number,
    }
}

export class Body extends jspb.Message { 
    clearTransactionsList(): void;
    getTransactionsList(): Array<Transaction>;
    setTransactionsList(value: Array<Transaction>): Body;
    addTransactions(value?: Transaction, index?: number): Transaction;
    clearOmmersList(): void;
    getOmmersList(): Array<Uint8Array | string>;
    getOmmersList_asU8(): Array<Uint8Array>;
    getOmmersList_asB64(): Array<string>;
    setOmmersList(value: Array<Uint8Array | string>): Body;
    addOmmers(value: Uint8Array | string, index?: number): Uint8Array | string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Body.AsObject;
    static toObject(includeInstance: boolean, msg: Body): Body.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Body, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Body;
    static deserializeBinaryFromReader(message: Body, reader: jspb.BinaryReader): Body;
}

export namespace Body {
    export type AsObject = {
        transactionsList: Array<Transaction.AsObject>,
        ommersList: Array<Uint8Array | string>,
    }
}

export class Block extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): Block;

    hasBody(): boolean;
    clearBody(): void;
    getBody(): Body | undefined;
    setBody(value?: Body): Block;

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
        header?: Header.AsObject,
        body?: Body.AsObject,
    }
}
