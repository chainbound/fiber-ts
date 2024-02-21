// package: eth
// file: eth.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

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
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(
    message: Transaction,
    reader: jspb.BinaryReader
  ): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    to: Uint8Array | string;
    gas: number;
    gasPrice: number;
    hash: Uint8Array | string;
    input: Uint8Array | string;
    nonce: number;
    value: Uint8Array | string;
    from: Uint8Array | string;
    type: number;
    maxFee: number;
    priorityFee: number;
    v: number;
    r: Uint8Array | string;
    s: Uint8Array | string;
    chainid: number;
    accessListList: Array<AccessTuple.AsObject>;
  };
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
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AccessTuple, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccessTuple;
  static deserializeBinaryFromReader(
    message: AccessTuple,
    reader: jspb.BinaryReader
  ): AccessTuple;
}

export namespace AccessTuple {
  export type AsObject = {
    address: Uint8Array | string;
    storageKeysList: Array<Uint8Array | string>;
  };
}

export class ExecutionPayload extends jspb.Message {
  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): ExecutionPayloadHeader | undefined;
  setHeader(value?: ExecutionPayloadHeader): ExecutionPayload;
  clearTransactionsList(): void;
  getTransactionsList(): Array<Transaction>;
  setTransactionsList(value: Array<Transaction>): ExecutionPayload;
  addTransactions(value?: Transaction, index?: number): Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionPayload.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ExecutionPayload
  ): ExecutionPayload.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ExecutionPayload,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionPayload;
  static deserializeBinaryFromReader(
    message: ExecutionPayload,
    reader: jspb.BinaryReader
  ): ExecutionPayload;
}

export namespace ExecutionPayload {
  export type AsObject = {
    header?: ExecutionPayloadHeader.AsObject;
    transactionsList: Array<Transaction.AsObject>;
  };
}

export class ExecutionPayloadHeader extends jspb.Message {
  getParentHash(): Uint8Array | string;
  getParentHash_asU8(): Uint8Array;
  getParentHash_asB64(): string;
  setParentHash(value: Uint8Array | string): ExecutionPayloadHeader;
  getFeeRecipient(): Uint8Array | string;
  getFeeRecipient_asU8(): Uint8Array;
  getFeeRecipient_asB64(): string;
  setFeeRecipient(value: Uint8Array | string): ExecutionPayloadHeader;
  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): ExecutionPayloadHeader;
  getReceiptsRoot(): Uint8Array | string;
  getReceiptsRoot_asU8(): Uint8Array;
  getReceiptsRoot_asB64(): string;
  setReceiptsRoot(value: Uint8Array | string): ExecutionPayloadHeader;
  getLogsBloom(): Uint8Array | string;
  getLogsBloom_asU8(): Uint8Array;
  getLogsBloom_asB64(): string;
  setLogsBloom(value: Uint8Array | string): ExecutionPayloadHeader;
  getPrevRandao(): Uint8Array | string;
  getPrevRandao_asU8(): Uint8Array;
  getPrevRandao_asB64(): string;
  setPrevRandao(value: Uint8Array | string): ExecutionPayloadHeader;
  getBlockNumber(): number;
  setBlockNumber(value: number): ExecutionPayloadHeader;
  getGasLimit(): number;
  setGasLimit(value: number): ExecutionPayloadHeader;
  getGasUsed(): number;
  setGasUsed(value: number): ExecutionPayloadHeader;
  getTimestamp(): number;
  setTimestamp(value: number): ExecutionPayloadHeader;
  getExtraData(): Uint8Array | string;
  getExtraData_asU8(): Uint8Array;
  getExtraData_asB64(): string;
  setExtraData(value: Uint8Array | string): ExecutionPayloadHeader;
  getBaseFeePerGas(): Uint8Array | string;
  getBaseFeePerGas_asU8(): Uint8Array;
  getBaseFeePerGas_asB64(): string;
  setBaseFeePerGas(value: Uint8Array | string): ExecutionPayloadHeader;
  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): ExecutionPayloadHeader;
  getTransactionsRoot(): Uint8Array | string;
  getTransactionsRoot_asU8(): Uint8Array;
  getTransactionsRoot_asB64(): string;
  setTransactionsRoot(value: Uint8Array | string): ExecutionPayloadHeader;

  hasWithdrawalsRoot(): boolean;
  clearWithdrawalsRoot(): void;
  getWithdrawalsRoot(): Uint8Array | string;
  getWithdrawalsRoot_asU8(): Uint8Array;
  getWithdrawalsRoot_asB64(): string;
  setWithdrawalsRoot(value: Uint8Array | string): ExecutionPayloadHeader;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionPayloadHeader.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ExecutionPayloadHeader
  ): ExecutionPayloadHeader.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ExecutionPayloadHeader,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionPayloadHeader;
  static deserializeBinaryFromReader(
    message: ExecutionPayloadHeader,
    reader: jspb.BinaryReader
  ): ExecutionPayloadHeader;
}

export namespace ExecutionPayloadHeader {
  export type AsObject = {
    parentHash: Uint8Array | string;
    feeRecipient: Uint8Array | string;
    stateRoot: Uint8Array | string;
    receiptsRoot: Uint8Array | string;
    logsBloom: Uint8Array | string;
    prevRandao: Uint8Array | string;
    blockNumber: number;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    extraData: Uint8Array | string;
    baseFeePerGas: Uint8Array | string;
    blockHash: Uint8Array | string;
    transactionsRoot: Uint8Array | string;
    withdrawalsRoot: Uint8Array | string;
  };
}

export class BeaconBlock extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): BeaconBlock;
  getProposerIndex(): number;
  setProposerIndex(value: number): BeaconBlock;
  getParentRoot(): Uint8Array | string;
  getParentRoot_asU8(): Uint8Array;
  getParentRoot_asB64(): string;
  setParentRoot(value: Uint8Array | string): BeaconBlock;
  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): BeaconBlock;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): BeaconBlockBody | undefined;
  setBody(value?: BeaconBlockBody): BeaconBlock;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconBlock.AsObject;
  static toObject(includeInstance: boolean, msg: BeaconBlock): BeaconBlock.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: BeaconBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BeaconBlock;
  static deserializeBinaryFromReader(
    message: BeaconBlock,
    reader: jspb.BinaryReader
  ): BeaconBlock;
}

export namespace BeaconBlock {
  export type AsObject = {
    slot: number;
    proposerIndex: number;
    parentRoot: Uint8Array | string;
    stateRoot: Uint8Array | string;
    body?: BeaconBlockBody.AsObject;
  };
}

export class CompactBeaconBlock extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): CompactBeaconBlock;
  getProposerIndex(): number;
  setProposerIndex(value: number): CompactBeaconBlock;
  getParentRoot(): Uint8Array | string;
  getParentRoot_asU8(): Uint8Array;
  getParentRoot_asB64(): string;
  setParentRoot(value: Uint8Array | string): CompactBeaconBlock;
  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): CompactBeaconBlock;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): CompactBeaconBlockBody | undefined;
  setBody(value?: CompactBeaconBlockBody): CompactBeaconBlock;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompactBeaconBlock.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CompactBeaconBlock
  ): CompactBeaconBlock.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: CompactBeaconBlock,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CompactBeaconBlock;
  static deserializeBinaryFromReader(
    message: CompactBeaconBlock,
    reader: jspb.BinaryReader
  ): CompactBeaconBlock;
}

export namespace CompactBeaconBlock {
  export type AsObject = {
    slot: number;
    proposerIndex: number;
    parentRoot: Uint8Array | string;
    stateRoot: Uint8Array | string;
    body?: CompactBeaconBlockBody.AsObject;
  };
}

export class SignedBeaconBlock extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): BeaconBlock | undefined;
  setMessage(value?: BeaconBlock): SignedBeaconBlock;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): SignedBeaconBlock;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedBeaconBlock.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SignedBeaconBlock
  ): SignedBeaconBlock.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: SignedBeaconBlock,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): SignedBeaconBlock;
  static deserializeBinaryFromReader(
    message: SignedBeaconBlock,
    reader: jspb.BinaryReader
  ): SignedBeaconBlock;
}

export namespace SignedBeaconBlock {
  export type AsObject = {
    message?: BeaconBlock.AsObject;
    signature: Uint8Array | string;
  };
}

export class BeaconBlockBody extends jspb.Message {
  getRandaoReveal(): Uint8Array | string;
  getRandaoReveal_asU8(): Uint8Array;
  getRandaoReveal_asB64(): string;
  setRandaoReveal(value: Uint8Array | string): BeaconBlockBody;

  hasEth1Data(): boolean;
  clearEth1Data(): void;
  getEth1Data(): Eth1Data | undefined;
  setEth1Data(value?: Eth1Data): BeaconBlockBody;
  getGraffiti(): Uint8Array | string;
  getGraffiti_asU8(): Uint8Array;
  getGraffiti_asB64(): string;
  setGraffiti(value: Uint8Array | string): BeaconBlockBody;
  clearProposerSlashingsList(): void;
  getProposerSlashingsList(): Array<ProposerSlashing>;
  setProposerSlashingsList(value: Array<ProposerSlashing>): BeaconBlockBody;
  addProposerSlashings(value?: ProposerSlashing, index?: number): ProposerSlashing;
  clearAttesterSlashingsList(): void;
  getAttesterSlashingsList(): Array<AttesterSlashing>;
  setAttesterSlashingsList(value: Array<AttesterSlashing>): BeaconBlockBody;
  addAttesterSlashings(value?: AttesterSlashing, index?: number): AttesterSlashing;
  clearAttestationsList(): void;
  getAttestationsList(): Array<Attestation>;
  setAttestationsList(value: Array<Attestation>): BeaconBlockBody;
  addAttestations(value?: Attestation, index?: number): Attestation;
  clearDepositsList(): void;
  getDepositsList(): Array<Deposit>;
  setDepositsList(value: Array<Deposit>): BeaconBlockBody;
  addDeposits(value?: Deposit, index?: number): Deposit;
  clearVoluntaryExitsList(): void;
  getVoluntaryExitsList(): Array<SignedVoluntaryExit>;
  setVoluntaryExitsList(value: Array<SignedVoluntaryExit>): BeaconBlockBody;
  addVoluntaryExits(value?: SignedVoluntaryExit, index?: number): SignedVoluntaryExit;

  hasSyncAggregate(): boolean;
  clearSyncAggregate(): void;
  getSyncAggregate(): SyncAggregate | undefined;
  setSyncAggregate(value?: SyncAggregate): BeaconBlockBody;

  hasExecutionPayload(): boolean;
  clearExecutionPayload(): void;
  getExecutionPayload(): ExecutionPayload | undefined;
  setExecutionPayload(value?: ExecutionPayload): BeaconBlockBody;
  clearBlsToExecutionChangesList(): void;
  getBlsToExecutionChangesList(): Array<SignedBLSToExecutionChange>;
  setBlsToExecutionChangesList(value: Array<SignedBLSToExecutionChange>): BeaconBlockBody;
  addBlsToExecutionChanges(
    value?: SignedBLSToExecutionChange,
    index?: number
  ): SignedBLSToExecutionChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconBlockBody.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BeaconBlockBody
  ): BeaconBlockBody.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BeaconBlockBody,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): BeaconBlockBody;
  static deserializeBinaryFromReader(
    message: BeaconBlockBody,
    reader: jspb.BinaryReader
  ): BeaconBlockBody;
}

export namespace BeaconBlockBody {
  export type AsObject = {
    randaoReveal: Uint8Array | string;
    eth1Data?: Eth1Data.AsObject;
    graffiti: Uint8Array | string;
    proposerSlashingsList: Array<ProposerSlashing.AsObject>;
    attesterSlashingsList: Array<AttesterSlashing.AsObject>;
    attestationsList: Array<Attestation.AsObject>;
    depositsList: Array<Deposit.AsObject>;
    voluntaryExitsList: Array<SignedVoluntaryExit.AsObject>;
    syncAggregate?: SyncAggregate.AsObject;
    executionPayload?: ExecutionPayload.AsObject;
    blsToExecutionChangesList: Array<SignedBLSToExecutionChange.AsObject>;
  };
}

export class CompactBeaconBlockBody extends jspb.Message {
  getRandaoReveal(): Uint8Array | string;
  getRandaoReveal_asU8(): Uint8Array;
  getRandaoReveal_asB64(): string;
  setRandaoReveal(value: Uint8Array | string): CompactBeaconBlockBody;

  hasEth1Data(): boolean;
  clearEth1Data(): void;
  getEth1Data(): Eth1Data | undefined;
  setEth1Data(value?: Eth1Data): CompactBeaconBlockBody;
  getGraffiti(): Uint8Array | string;
  getGraffiti_asU8(): Uint8Array;
  getGraffiti_asB64(): string;
  setGraffiti(value: Uint8Array | string): CompactBeaconBlockBody;
  clearProposerSlashingsList(): void;
  getProposerSlashingsList(): Array<ProposerSlashing>;
  setProposerSlashingsList(value: Array<ProposerSlashing>): CompactBeaconBlockBody;
  addProposerSlashings(value?: ProposerSlashing, index?: number): ProposerSlashing;
  clearAttesterSlashingsList(): void;
  getAttesterSlashingsList(): Array<AttesterSlashing>;
  setAttesterSlashingsList(value: Array<AttesterSlashing>): CompactBeaconBlockBody;
  addAttesterSlashings(value?: AttesterSlashing, index?: number): AttesterSlashing;
  clearAttestationsList(): void;
  getAttestationsList(): Array<Attestation>;
  setAttestationsList(value: Array<Attestation>): CompactBeaconBlockBody;
  addAttestations(value?: Attestation, index?: number): Attestation;
  clearDepositsList(): void;
  getDepositsList(): Array<Deposit>;
  setDepositsList(value: Array<Deposit>): CompactBeaconBlockBody;
  addDeposits(value?: Deposit, index?: number): Deposit;
  clearVoluntaryExitsList(): void;
  getVoluntaryExitsList(): Array<SignedVoluntaryExit>;
  setVoluntaryExitsList(value: Array<SignedVoluntaryExit>): CompactBeaconBlockBody;
  addVoluntaryExits(value?: SignedVoluntaryExit, index?: number): SignedVoluntaryExit;

  hasSyncAggregate(): boolean;
  clearSyncAggregate(): void;
  getSyncAggregate(): SyncAggregate | undefined;
  setSyncAggregate(value?: SyncAggregate): CompactBeaconBlockBody;
  clearBlsToExecutionChangesList(): void;
  getBlsToExecutionChangesList(): Array<SignedBLSToExecutionChange>;
  setBlsToExecutionChangesList(
    value: Array<SignedBLSToExecutionChange>
  ): CompactBeaconBlockBody;
  addBlsToExecutionChanges(
    value?: SignedBLSToExecutionChange,
    index?: number
  ): SignedBLSToExecutionChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompactBeaconBlockBody.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CompactBeaconBlockBody
  ): CompactBeaconBlockBody.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: CompactBeaconBlockBody,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CompactBeaconBlockBody;
  static deserializeBinaryFromReader(
    message: CompactBeaconBlockBody,
    reader: jspb.BinaryReader
  ): CompactBeaconBlockBody;
}

export namespace CompactBeaconBlockBody {
  export type AsObject = {
    randaoReveal: Uint8Array | string;
    eth1Data?: Eth1Data.AsObject;
    graffiti: Uint8Array | string;
    proposerSlashingsList: Array<ProposerSlashing.AsObject>;
    attesterSlashingsList: Array<AttesterSlashing.AsObject>;
    attestationsList: Array<Attestation.AsObject>;
    depositsList: Array<Deposit.AsObject>;
    voluntaryExitsList: Array<SignedVoluntaryExit.AsObject>;
    syncAggregate?: SyncAggregate.AsObject;
    blsToExecutionChangesList: Array<SignedBLSToExecutionChange.AsObject>;
  };
}

export class SignedBeaconBlockHeader extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): BeaconBlockHeader | undefined;
  setMessage(value?: BeaconBlockHeader): SignedBeaconBlockHeader;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): SignedBeaconBlockHeader;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedBeaconBlockHeader.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SignedBeaconBlockHeader
  ): SignedBeaconBlockHeader.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: SignedBeaconBlockHeader,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): SignedBeaconBlockHeader;
  static deserializeBinaryFromReader(
    message: SignedBeaconBlockHeader,
    reader: jspb.BinaryReader
  ): SignedBeaconBlockHeader;
}

export namespace SignedBeaconBlockHeader {
  export type AsObject = {
    message?: BeaconBlockHeader.AsObject;
    signature: Uint8Array | string;
  };
}

export class BeaconBlockHeader extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): BeaconBlockHeader;
  getProposerIndex(): number;
  setProposerIndex(value: number): BeaconBlockHeader;
  getParentRoot(): Uint8Array | string;
  getParentRoot_asU8(): Uint8Array;
  getParentRoot_asB64(): string;
  setParentRoot(value: Uint8Array | string): BeaconBlockHeader;
  getStateRoot(): Uint8Array | string;
  getStateRoot_asU8(): Uint8Array;
  getStateRoot_asB64(): string;
  setStateRoot(value: Uint8Array | string): BeaconBlockHeader;
  getBodyRoot(): Uint8Array | string;
  getBodyRoot_asU8(): Uint8Array;
  getBodyRoot_asB64(): string;
  setBodyRoot(value: Uint8Array | string): BeaconBlockHeader;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BeaconBlockHeader.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BeaconBlockHeader
  ): BeaconBlockHeader.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BeaconBlockHeader,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): BeaconBlockHeader;
  static deserializeBinaryFromReader(
    message: BeaconBlockHeader,
    reader: jspb.BinaryReader
  ): BeaconBlockHeader;
}

export namespace BeaconBlockHeader {
  export type AsObject = {
    slot: number;
    proposerIndex: number;
    parentRoot: Uint8Array | string;
    stateRoot: Uint8Array | string;
    bodyRoot: Uint8Array | string;
  };
}

export class Eth1Data extends jspb.Message {
  getDepositRoot(): Uint8Array | string;
  getDepositRoot_asU8(): Uint8Array;
  getDepositRoot_asB64(): string;
  setDepositRoot(value: Uint8Array | string): Eth1Data;
  getDepositCount(): number;
  setDepositCount(value: number): Eth1Data;
  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): Eth1Data;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Eth1Data.AsObject;
  static toObject(includeInstance: boolean, msg: Eth1Data): Eth1Data.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Eth1Data, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Eth1Data;
  static deserializeBinaryFromReader(
    message: Eth1Data,
    reader: jspb.BinaryReader
  ): Eth1Data;
}

export namespace Eth1Data {
  export type AsObject = {
    depositRoot: Uint8Array | string;
    depositCount: number;
    blockHash: Uint8Array | string;
  };
}

export class SignedVoluntaryExit extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): VoluntaryExit | undefined;
  setMessage(value?: VoluntaryExit): SignedVoluntaryExit;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): SignedVoluntaryExit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedVoluntaryExit.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SignedVoluntaryExit
  ): SignedVoluntaryExit.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: SignedVoluntaryExit,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): SignedVoluntaryExit;
  static deserializeBinaryFromReader(
    message: SignedVoluntaryExit,
    reader: jspb.BinaryReader
  ): SignedVoluntaryExit;
}

export namespace SignedVoluntaryExit {
  export type AsObject = {
    message?: VoluntaryExit.AsObject;
    signature: Uint8Array | string;
  };
}

export class VoluntaryExit extends jspb.Message {
  getEpoch(): number;
  setEpoch(value: number): VoluntaryExit;
  getValidatorIndex(): number;
  setValidatorIndex(value: number): VoluntaryExit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoluntaryExit.AsObject;
  static toObject(includeInstance: boolean, msg: VoluntaryExit): VoluntaryExit.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: VoluntaryExit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoluntaryExit;
  static deserializeBinaryFromReader(
    message: VoluntaryExit,
    reader: jspb.BinaryReader
  ): VoluntaryExit;
}

export namespace VoluntaryExit {
  export type AsObject = {
    epoch: number;
    validatorIndex: number;
  };
}

export class ProposerSlashing extends jspb.Message {
  hasHeader1(): boolean;
  clearHeader1(): void;
  getHeader1(): SignedBeaconBlockHeader | undefined;
  setHeader1(value?: SignedBeaconBlockHeader): ProposerSlashing;

  hasHeader2(): boolean;
  clearHeader2(): void;
  getHeader2(): SignedBeaconBlockHeader | undefined;
  setHeader2(value?: SignedBeaconBlockHeader): ProposerSlashing;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProposerSlashing.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ProposerSlashing
  ): ProposerSlashing.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ProposerSlashing,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ProposerSlashing;
  static deserializeBinaryFromReader(
    message: ProposerSlashing,
    reader: jspb.BinaryReader
  ): ProposerSlashing;
}

export namespace ProposerSlashing {
  export type AsObject = {
    header1?: SignedBeaconBlockHeader.AsObject;
    header2?: SignedBeaconBlockHeader.AsObject;
  };
}

export class AttesterSlashing extends jspb.Message {
  hasAttestation1(): boolean;
  clearAttestation1(): void;
  getAttestation1(): IndexedAttestation | undefined;
  setAttestation1(value?: IndexedAttestation): AttesterSlashing;

  hasAttestation2(): boolean;
  clearAttestation2(): void;
  getAttestation2(): IndexedAttestation | undefined;
  setAttestation2(value?: IndexedAttestation): AttesterSlashing;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttesterSlashing.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttesterSlashing
  ): AttesterSlashing.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: AttesterSlashing,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttesterSlashing;
  static deserializeBinaryFromReader(
    message: AttesterSlashing,
    reader: jspb.BinaryReader
  ): AttesterSlashing;
}

export namespace AttesterSlashing {
  export type AsObject = {
    attestation1?: IndexedAttestation.AsObject;
    attestation2?: IndexedAttestation.AsObject;
  };
}

export class IndexedAttestation extends jspb.Message {
  clearAttestingIndicesList(): void;
  getAttestingIndicesList(): Array<number>;
  setAttestingIndicesList(value: Array<number>): IndexedAttestation;
  addAttestingIndices(value: number, index?: number): number;

  hasData(): boolean;
  clearData(): void;
  getData(): AttestationData | undefined;
  setData(value?: AttestationData): IndexedAttestation;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): IndexedAttestation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IndexedAttestation.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: IndexedAttestation
  ): IndexedAttestation.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: IndexedAttestation,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): IndexedAttestation;
  static deserializeBinaryFromReader(
    message: IndexedAttestation,
    reader: jspb.BinaryReader
  ): IndexedAttestation;
}

export namespace IndexedAttestation {
  export type AsObject = {
    attestingIndicesList: Array<number>;
    data?: AttestationData.AsObject;
    signature: Uint8Array | string;
  };
}

export class AttestationData extends jspb.Message {
  getSlot(): number;
  setSlot(value: number): AttestationData;
  getIndex(): number;
  setIndex(value: number): AttestationData;
  getBeaconBlockRoot(): Uint8Array | string;
  getBeaconBlockRoot_asU8(): Uint8Array;
  getBeaconBlockRoot_asB64(): string;
  setBeaconBlockRoot(value: Uint8Array | string): AttestationData;

  hasSource(): boolean;
  clearSource(): void;
  getSource(): Checkpoint | undefined;
  setSource(value?: Checkpoint): AttestationData;

  hasTarget(): boolean;
  clearTarget(): void;
  getTarget(): Checkpoint | undefined;
  setTarget(value?: Checkpoint): AttestationData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttestationData.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttestationData
  ): AttestationData.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: AttestationData,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttestationData;
  static deserializeBinaryFromReader(
    message: AttestationData,
    reader: jspb.BinaryReader
  ): AttestationData;
}

export namespace AttestationData {
  export type AsObject = {
    slot: number;
    index: number;
    beaconBlockRoot: Uint8Array | string;
    source?: Checkpoint.AsObject;
    target?: Checkpoint.AsObject;
  };
}

export class Checkpoint extends jspb.Message {
  getEpoch(): number;
  setEpoch(value: number): Checkpoint;
  getRoot(): Uint8Array | string;
  getRoot_asU8(): Uint8Array;
  getRoot_asB64(): string;
  setRoot(value: Uint8Array | string): Checkpoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Checkpoint.AsObject;
  static toObject(includeInstance: boolean, msg: Checkpoint): Checkpoint.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Checkpoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Checkpoint;
  static deserializeBinaryFromReader(
    message: Checkpoint,
    reader: jspb.BinaryReader
  ): Checkpoint;
}

export namespace Checkpoint {
  export type AsObject = {
    epoch: number;
    root: Uint8Array | string;
  };
}

export class Attestation extends jspb.Message {
  getAggregationBits(): Uint8Array | string;
  getAggregationBits_asU8(): Uint8Array;
  getAggregationBits_asB64(): string;
  setAggregationBits(value: Uint8Array | string): Attestation;

  hasData(): boolean;
  clearData(): void;
  getData(): AttestationData | undefined;
  setData(value?: AttestationData): Attestation;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): Attestation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Attestation.AsObject;
  static toObject(includeInstance: boolean, msg: Attestation): Attestation.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Attestation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Attestation;
  static deserializeBinaryFromReader(
    message: Attestation,
    reader: jspb.BinaryReader
  ): Attestation;
}

export namespace Attestation {
  export type AsObject = {
    aggregationBits: Uint8Array | string;
    data?: AttestationData.AsObject;
    signature: Uint8Array | string;
  };
}

export class Deposit extends jspb.Message {
  clearProofList(): void;
  getProofList(): Array<Uint8Array | string>;
  getProofList_asU8(): Array<Uint8Array>;
  getProofList_asB64(): Array<string>;
  setProofList(value: Array<Uint8Array | string>): Deposit;
  addProof(value: Uint8Array | string, index?: number): Uint8Array | string;

  hasData(): boolean;
  clearData(): void;
  getData(): DepositData | undefined;
  setData(value?: DepositData): Deposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Deposit.AsObject;
  static toObject(includeInstance: boolean, msg: Deposit): Deposit.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Deposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Deposit;
  static deserializeBinaryFromReader(
    message: Deposit,
    reader: jspb.BinaryReader
  ): Deposit;
}

export namespace Deposit {
  export type AsObject = {
    proofList: Array<Uint8Array | string>;
    data?: DepositData.AsObject;
  };
}

export class DepositData extends jspb.Message {
  getPubkey(): Uint8Array | string;
  getPubkey_asU8(): Uint8Array;
  getPubkey_asB64(): string;
  setPubkey(value: Uint8Array | string): DepositData;
  getWithdrawalCredentials(): Uint8Array | string;
  getWithdrawalCredentials_asU8(): Uint8Array;
  getWithdrawalCredentials_asB64(): string;
  setWithdrawalCredentials(value: Uint8Array | string): DepositData;
  getAmount(): number;
  setAmount(value: number): DepositData;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): DepositData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositData.AsObject;
  static toObject(includeInstance: boolean, msg: DepositData): DepositData.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DepositData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositData;
  static deserializeBinaryFromReader(
    message: DepositData,
    reader: jspb.BinaryReader
  ): DepositData;
}

export namespace DepositData {
  export type AsObject = {
    pubkey: Uint8Array | string;
    withdrawalCredentials: Uint8Array | string;
    amount: number;
    signature: Uint8Array | string;
  };
}

export class SyncAggregate extends jspb.Message {
  getSyncCommitteeBits(): Uint8Array | string;
  getSyncCommitteeBits_asU8(): Uint8Array;
  getSyncCommitteeBits_asB64(): string;
  setSyncCommitteeBits(value: Uint8Array | string): SyncAggregate;
  getSyncCommitteeSignature(): Uint8Array | string;
  getSyncCommitteeSignature_asU8(): Uint8Array;
  getSyncCommitteeSignature_asB64(): string;
  setSyncCommitteeSignature(value: Uint8Array | string): SyncAggregate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncAggregate.AsObject;
  static toObject(includeInstance: boolean, msg: SyncAggregate): SyncAggregate.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: SyncAggregate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncAggregate;
  static deserializeBinaryFromReader(
    message: SyncAggregate,
    reader: jspb.BinaryReader
  ): SyncAggregate;
}

export namespace SyncAggregate {
  export type AsObject = {
    syncCommitteeBits: Uint8Array | string;
    syncCommitteeSignature: Uint8Array | string;
  };
}

export class SignedBLSToExecutionChange extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): BLSToExecutionChange | undefined;
  setMessage(value?: BLSToExecutionChange): SignedBLSToExecutionChange;
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): SignedBLSToExecutionChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedBLSToExecutionChange.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SignedBLSToExecutionChange
  ): SignedBLSToExecutionChange.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: SignedBLSToExecutionChange,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): SignedBLSToExecutionChange;
  static deserializeBinaryFromReader(
    message: SignedBLSToExecutionChange,
    reader: jspb.BinaryReader
  ): SignedBLSToExecutionChange;
}

export namespace SignedBLSToExecutionChange {
  export type AsObject = {
    message?: BLSToExecutionChange.AsObject;
    signature: Uint8Array | string;
  };
}

export class BLSToExecutionChange extends jspb.Message {
  getValidatorIndex(): number;
  setValidatorIndex(value: number): BLSToExecutionChange;
  getFromBlsPubkey(): Uint8Array | string;
  getFromBlsPubkey_asU8(): Uint8Array;
  getFromBlsPubkey_asB64(): string;
  setFromBlsPubkey(value: Uint8Array | string): BLSToExecutionChange;
  getToExecutionAddress(): Uint8Array | string;
  getToExecutionAddress_asU8(): Uint8Array;
  getToExecutionAddress_asB64(): string;
  setToExecutionAddress(value: Uint8Array | string): BLSToExecutionChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BLSToExecutionChange.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BLSToExecutionChange
  ): BLSToExecutionChange.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BLSToExecutionChange,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): BLSToExecutionChange;
  static deserializeBinaryFromReader(
    message: BLSToExecutionChange,
    reader: jspb.BinaryReader
  ): BLSToExecutionChange;
}

export namespace BLSToExecutionChange {
  export type AsObject = {
    validatorIndex: number;
    fromBlsPubkey: Uint8Array | string;
    toExecutionAddress: Uint8Array | string;
  };
}
