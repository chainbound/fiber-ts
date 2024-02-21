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
