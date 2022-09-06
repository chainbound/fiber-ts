// package: types
// file: types.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class H128 extends jspb.Message { 
    getHi(): number;
    setHi(value: number): H128;
    getLo(): number;
    setLo(value: number): H128;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H128.AsObject;
    static toObject(includeInstance: boolean, msg: H128): H128.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H128, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H128;
    static deserializeBinaryFromReader(message: H128, reader: jspb.BinaryReader): H128;
}

export namespace H128 {
    export type AsObject = {
        hi: number,
        lo: number,
    }
}

export class H160 extends jspb.Message { 

    hasHi(): boolean;
    clearHi(): void;
    getHi(): H128 | undefined;
    setHi(value?: H128): H160;
    getLo(): number;
    setLo(value: number): H160;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H160.AsObject;
    static toObject(includeInstance: boolean, msg: H160): H160.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H160, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H160;
    static deserializeBinaryFromReader(message: H160, reader: jspb.BinaryReader): H160;
}

export namespace H160 {
    export type AsObject = {
        hi?: H128.AsObject,
        lo: number,
    }
}

export class H256 extends jspb.Message { 

    hasHi(): boolean;
    clearHi(): void;
    getHi(): H128 | undefined;
    setHi(value?: H128): H256;

    hasLo(): boolean;
    clearLo(): void;
    getLo(): H128 | undefined;
    setLo(value?: H128): H256;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H256.AsObject;
    static toObject(includeInstance: boolean, msg: H256): H256.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H256, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H256;
    static deserializeBinaryFromReader(message: H256, reader: jspb.BinaryReader): H256;
}

export namespace H256 {
    export type AsObject = {
        hi?: H128.AsObject,
        lo?: H128.AsObject,
    }
}

export class H512 extends jspb.Message { 

    hasHi(): boolean;
    clearHi(): void;
    getHi(): H256 | undefined;
    setHi(value?: H256): H512;

    hasLo(): boolean;
    clearLo(): void;
    getLo(): H256 | undefined;
    setLo(value?: H256): H512;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H512.AsObject;
    static toObject(includeInstance: boolean, msg: H512): H512.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H512, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H512;
    static deserializeBinaryFromReader(message: H512, reader: jspb.BinaryReader): H512;
}

export namespace H512 {
    export type AsObject = {
        hi?: H256.AsObject,
        lo?: H256.AsObject,
    }
}

export class H1024 extends jspb.Message { 

    hasHi(): boolean;
    clearHi(): void;
    getHi(): H512 | undefined;
    setHi(value?: H512): H1024;

    hasLo(): boolean;
    clearLo(): void;
    getLo(): H512 | undefined;
    setLo(value?: H512): H1024;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H1024.AsObject;
    static toObject(includeInstance: boolean, msg: H1024): H1024.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H1024, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H1024;
    static deserializeBinaryFromReader(message: H1024, reader: jspb.BinaryReader): H1024;
}

export namespace H1024 {
    export type AsObject = {
        hi?: H512.AsObject,
        lo?: H512.AsObject,
    }
}

export class H2048 extends jspb.Message { 

    hasHi(): boolean;
    clearHi(): void;
    getHi(): H1024 | undefined;
    setHi(value?: H1024): H2048;

    hasLo(): boolean;
    clearLo(): void;
    getLo(): H1024 | undefined;
    setLo(value?: H1024): H2048;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): H2048.AsObject;
    static toObject(includeInstance: boolean, msg: H2048): H2048.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: H2048, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): H2048;
    static deserializeBinaryFromReader(message: H2048, reader: jspb.BinaryReader): H2048;
}

export namespace H2048 {
    export type AsObject = {
        hi?: H1024.AsObject,
        lo?: H1024.AsObject,
    }
}

export class VersionReply extends jspb.Message { 
    getMajor(): number;
    setMajor(value: number): VersionReply;
    getMinor(): number;
    setMinor(value: number): VersionReply;
    getPatch(): number;
    setPatch(value: number): VersionReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VersionReply.AsObject;
    static toObject(includeInstance: boolean, msg: VersionReply): VersionReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VersionReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VersionReply;
    static deserializeBinaryFromReader(message: VersionReply, reader: jspb.BinaryReader): VersionReply;
}

export namespace VersionReply {
    export type AsObject = {
        major: number,
        minor: number,
        patch: number,
    }
}

export class ExecutionPayload extends jspb.Message { 

    hasParenthash(): boolean;
    clearParenthash(): void;
    getParenthash(): H256 | undefined;
    setParenthash(value?: H256): ExecutionPayload;

    hasCoinbase(): boolean;
    clearCoinbase(): void;
    getCoinbase(): H160 | undefined;
    setCoinbase(value?: H160): ExecutionPayload;

    hasStateroot(): boolean;
    clearStateroot(): void;
    getStateroot(): H256 | undefined;
    setStateroot(value?: H256): ExecutionPayload;

    hasReceiptroot(): boolean;
    clearReceiptroot(): void;
    getReceiptroot(): H256 | undefined;
    setReceiptroot(value?: H256): ExecutionPayload;

    hasLogsbloom(): boolean;
    clearLogsbloom(): void;
    getLogsbloom(): H2048 | undefined;
    setLogsbloom(value?: H2048): ExecutionPayload;

    hasPrevrandao(): boolean;
    clearPrevrandao(): void;
    getPrevrandao(): H256 | undefined;
    setPrevrandao(value?: H256): ExecutionPayload;
    getBlocknumber(): number;
    setBlocknumber(value: number): ExecutionPayload;
    getGaslimit(): number;
    setGaslimit(value: number): ExecutionPayload;
    getGasused(): number;
    setGasused(value: number): ExecutionPayload;
    getTimestamp(): number;
    setTimestamp(value: number): ExecutionPayload;
    getExtradata(): Uint8Array | string;
    getExtradata_asU8(): Uint8Array;
    getExtradata_asB64(): string;
    setExtradata(value: Uint8Array | string): ExecutionPayload;

    hasBasefeepergas(): boolean;
    clearBasefeepergas(): void;
    getBasefeepergas(): H256 | undefined;
    setBasefeepergas(value?: H256): ExecutionPayload;

    hasBlockhash(): boolean;
    clearBlockhash(): void;
    getBlockhash(): H256 | undefined;
    setBlockhash(value?: H256): ExecutionPayload;
    clearTransactionsList(): void;
    getTransactionsList(): Array<Uint8Array | string>;
    getTransactionsList_asU8(): Array<Uint8Array>;
    getTransactionsList_asB64(): Array<string>;
    setTransactionsList(value: Array<Uint8Array | string>): ExecutionPayload;
    addTransactions(value: Uint8Array | string, index?: number): Uint8Array | string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionPayload.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionPayload): ExecutionPayload.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionPayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionPayload;
    static deserializeBinaryFromReader(message: ExecutionPayload, reader: jspb.BinaryReader): ExecutionPayload;
}

export namespace ExecutionPayload {
    export type AsObject = {
        parenthash?: H256.AsObject,
        coinbase?: H160.AsObject,
        stateroot?: H256.AsObject,
        receiptroot?: H256.AsObject,
        logsbloom?: H2048.AsObject,
        prevrandao?: H256.AsObject,
        blocknumber: number,
        gaslimit: number,
        gasused: number,
        timestamp: number,
        extradata: Uint8Array | string,
        basefeepergas?: H256.AsObject,
        blockhash?: H256.AsObject,
        transactionsList: Array<Uint8Array | string>,
    }
}

export class NodeInfoPorts extends jspb.Message { 
    getDiscovery(): number;
    setDiscovery(value: number): NodeInfoPorts;
    getListener(): number;
    setListener(value: number): NodeInfoPorts;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeInfoPorts.AsObject;
    static toObject(includeInstance: boolean, msg: NodeInfoPorts): NodeInfoPorts.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeInfoPorts, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeInfoPorts;
    static deserializeBinaryFromReader(message: NodeInfoPorts, reader: jspb.BinaryReader): NodeInfoPorts;
}

export namespace NodeInfoPorts {
    export type AsObject = {
        discovery: number,
        listener: number,
    }
}

export class NodeInfoReply extends jspb.Message { 
    getId(): string;
    setId(value: string): NodeInfoReply;
    getName(): string;
    setName(value: string): NodeInfoReply;
    getEnode(): string;
    setEnode(value: string): NodeInfoReply;
    getEnr(): string;
    setEnr(value: string): NodeInfoReply;

    hasPorts(): boolean;
    clearPorts(): void;
    getPorts(): NodeInfoPorts | undefined;
    setPorts(value?: NodeInfoPorts): NodeInfoReply;
    getListeneraddr(): string;
    setListeneraddr(value: string): NodeInfoReply;
    getProtocols(): Uint8Array | string;
    getProtocols_asU8(): Uint8Array;
    getProtocols_asB64(): string;
    setProtocols(value: Uint8Array | string): NodeInfoReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeInfoReply.AsObject;
    static toObject(includeInstance: boolean, msg: NodeInfoReply): NodeInfoReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeInfoReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeInfoReply;
    static deserializeBinaryFromReader(message: NodeInfoReply, reader: jspb.BinaryReader): NodeInfoReply;
}

export namespace NodeInfoReply {
    export type AsObject = {
        id: string,
        name: string,
        enode: string,
        enr: string,
        ports?: NodeInfoPorts.AsObject,
        listeneraddr: string,
        protocols: Uint8Array | string,
    }
}

export class PeerInfo extends jspb.Message { 
    getId(): string;
    setId(value: string): PeerInfo;
    getName(): string;
    setName(value: string): PeerInfo;
    getEnode(): string;
    setEnode(value: string): PeerInfo;
    getEnr(): string;
    setEnr(value: string): PeerInfo;
    clearCapsList(): void;
    getCapsList(): Array<string>;
    setCapsList(value: Array<string>): PeerInfo;
    addCaps(value: string, index?: number): string;
    getConnlocaladdr(): string;
    setConnlocaladdr(value: string): PeerInfo;
    getConnremoteaddr(): string;
    setConnremoteaddr(value: string): PeerInfo;
    getConnisinbound(): boolean;
    setConnisinbound(value: boolean): PeerInfo;
    getConnistrusted(): boolean;
    setConnistrusted(value: boolean): PeerInfo;
    getConnisstatic(): boolean;
    setConnisstatic(value: boolean): PeerInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PeerInfo.AsObject;
    static toObject(includeInstance: boolean, msg: PeerInfo): PeerInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PeerInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PeerInfo;
    static deserializeBinaryFromReader(message: PeerInfo, reader: jspb.BinaryReader): PeerInfo;
}

export namespace PeerInfo {
    export type AsObject = {
        id: string,
        name: string,
        enode: string,
        enr: string,
        capsList: Array<string>,
        connlocaladdr: string,
        connremoteaddr: string,
        connisinbound: boolean,
        connistrusted: boolean,
        connisstatic: boolean,
    }
}
