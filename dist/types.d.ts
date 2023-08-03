import { ethers } from "ethers";
import { TypedTransaction } from "@ethereumjs/tx";
import eth from "../protobuf/eth_pb";
export interface TransactionResponse {
    hash: string;
    timestamp: number;
}
export interface ExecutionPayloadHeader {
    number: number;
    hash: string;
    parentHash: string;
    prevRandao: string;
    stateRoot: string;
    receiptRoot: string;
    feeRecipient: string;
    extraData: string;
    gasLimit: ethers.BigNumber;
    gasUsed: ethers.BigNumber;
    timestamp: number;
    logsBloom: string;
    baseFeePerGas: ethers.BigNumber;
}
export interface ExecutionPayload {
    header: ExecutionPayloadHeader;
    transactions: TypedTransaction[];
}
export interface BeaconBlock {
    slot: number;
    proposerIndex: number;
    parentRoot: Uint8Array | string;
    stateRoot: Uint8Array | string;
    body?: {
        randaoReveal: Uint8Array | string;
        eth1Data?: {
            depositRoot: Uint8Array | string;
            depositCount: number;
            blockHash: Uint8Array | string;
        };
        graffiti: Uint8Array | string;
        proposerSlashingsList: Array<ProposerSlashing>;
        attesterSlashingsList: Array<AttesterSlashing>;
        attestationsList: Array<{
            aggregationBits: Uint8Array | string;
            data?: AttestationData;
            signature: Uint8Array | string;
        }>;
        depositsList: Array<Deposit>;
        voluntaryExitsList: Array<{
            message?: {
                epoch: number;
                validatorIndex: number;
            };
            signature: Uint8Array | string;
        }>;
        syncAggregate?: {
            syncCommitteeBits: Uint8Array | string;
            syncCommitteeSignature: Uint8Array | string;
        };
        blsToExecutionChangesList: Array<{
            message?: {
                validatorIndex: number;
                fromBlsPubkey: Uint8Array | string;
                toExecutionAddress: Uint8Array | string;
            };
            signature: Uint8Array | string;
        }>;
    };
}
interface ProposerSlashing {
    header1?: SignedBeaconBlockHeader;
    header2?: SignedBeaconBlockHeader;
}
interface SignedBeaconBlockHeader {
    message?: BeaconBlockHeader;
    signature: Uint8Array | string;
}
interface BeaconBlockHeader {
    slot: number;
    proposerIndex: number;
    parentRoot: Uint8Array | string;
    stateRoot: Uint8Array | string;
    bodyRoot: Uint8Array | string;
}
interface AttesterSlashing {
    attestation1?: IndexedAttestation;
    attestation2?: IndexedAttestation;
}
interface IndexedAttestation {
    attestingIndicesList: Array<number>;
    data?: AttestationData;
    signature: Uint8Array | string;
}
interface AttestationData {
    slot: number;
    index: number;
    beaconBlockRoot: Uint8Array | string;
    source?: Checkpoint;
    target?: Checkpoint;
}
interface Checkpoint {
    epoch: number;
    root: Uint8Array | string;
}
interface Deposit {
    proofList: Array<Uint8Array | string>;
    data?: {
        pubkey: Uint8Array | string;
        withdrawalCredentials: Uint8Array | string;
        amount: number;
        signature: Uint8Array | string;
    };
}
export declare function bytesToHex(b: string | Uint8Array): string;
export declare function hexToBytes(str: string): Uint8Array;
export declare function fromProtoTx(tx: eth.Transaction): TypedTransaction;
export declare function toProtoTx(tx: TypedTransaction): eth.Transaction;
export declare function fromProtoExecutionHeader(block: eth.ExecutionPayloadHeader): ExecutionPayloadHeader;
export declare function fromProtoBeaconBlock(block: eth.CompactBeaconBlock): BeaconBlock;
export {};
