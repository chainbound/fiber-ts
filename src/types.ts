import { Address } from "@ethereumjs/util";
import { ethers } from "ethers";
import {
  AccessListEIP2930Transaction,
  AccessListItem,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
  TransactionFactory,
  TransactionType,
  TypedTransaction,
  isAccessListEIP2930Tx,
  isFeeMarketEIP1559Tx,
  isLegacyTx,
} from "@ethereumjs/tx";

import eth, { AccessTuple } from "../protobuf/eth_pb";
import { RLP } from "ethers/lib/utils";

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

// ============= TYPE CONVERSION UTILS ==============

export function bytesToHex(b: string | Uint8Array): string {
  return "0x" + Buffer.from(b).toString("hex");
}

export function hexToBytes(str: string): Uint8Array {
  if (!str) {
    return new Uint8Array();
  }

  if (str.substring(0, 2) !== "0x") {
    str = "0x" + str;
  }

  const a = [];
  for (let i = 2, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}

// ============== TRANSACTION CONVERSION UTILS ==============

function convertAccessList(list: Array<AccessTuple>): Array<AccessListItem> {
  return list.map((tuple) => {
    return {
      address: "0x" + Buffer.from(tuple.getAddress()).toString("hex"),
      storageKeys: tuple.getStorageKeysList().map((key) => "0x" + Buffer.from(key).toString("hex")),
    };
  });
}

export function fromProtoTx(tx: eth.Transaction): TypedTransaction {
  let value = 0n;
  if (tx.getValue()) {
    if (tx.getValue().length > 0) {
      value = RLP.decode(tx.getValue());
    }
  }

  let to;
  if (tx.getTo().length !== 0) {
    to = new Address(Buffer.from(tx.getTo()));
  } else {
    to = Address.zero();
  }

  switch (tx.getType()) {
    case TransactionType.Legacy:
      return LegacyTransaction.fromTxData({
        to: to,
        type: tx.getType(),
        nonce: BigInt(tx.getNonce()),
        gasLimit: BigInt(tx.getGas()),
        data: Buffer.from(tx.getInput()),
        value: value,
        gasPrice: BigInt(tx.getGasPrice()),
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString("hex")),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString("hex")),
      });
    case TransactionType.AccessListEIP2930:
      return AccessListEIP2930Transaction.fromTxData({
        to: to,
        type: tx.getType(),
        nonce: BigInt(tx.getNonce()),
        gasLimit: BigInt(tx.getGas()),
        data: Buffer.from(tx.getInput()),
        value: value,
        gasPrice: BigInt(tx.getGasPrice()),
        accessList: convertAccessList(tx.getAccessListList()),
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString("hex")),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString("hex")),
      });
    case TransactionType.FeeMarketEIP1559:
      return FeeMarketEIP1559Transaction.fromTxData({
        to: to,
        type: tx.getType(),
        nonce: BigInt(tx.getNonce()),
        gasLimit: BigInt(tx.getGas()),
        data: Buffer.from(tx.getInput()),
        value: value,
        maxFeePerGas: BigInt(tx.getMaxFee()),
        maxPriorityFeePerGas: BigInt(tx.getPriorityFee()),
        accessList: convertAccessList(tx.getAccessListList()),
        v: BigInt(tx.getV()),
        r: BigInt("0x" + Buffer.from(tx.getR()).toString("hex")),
        s: BigInt("0x" + Buffer.from(tx.getS()).toString("hex")),
      });
  }


  return TransactionFactory.fromTxData({
  });
}

// WARNING: if transaction is legacy, it will only work on Ethereum mainnet.
export function toProtoTx(tx: TypedTransaction): eth.Transaction {
  const proto = new eth.Transaction();

  if (isLegacyTx(tx)) {
    proto.setHash(tx.hash());
    proto.setFrom(tx.getSenderAddress().toBytes());
    if (tx.to) {
      proto.setTo(tx.to.toBytes());
    }
    proto.setType(tx.type);
    proto.setNonce(Number(tx.nonce));
    if (tx.data) {
      proto.setInput(tx.data);
    }

    proto.setChainid(1);
    proto.setValue(hexToBytes("0x" + tx.value.toString(16)));
    proto.setGas(Number(tx.gasLimit));
    proto.setGasPrice(Number(tx.gasPrice));
    proto.setV(Number(tx.v!));
    proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
    proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
  } else if (isAccessListEIP2930Tx(tx)) {
    proto.setHash(tx.hash());
    proto.setFrom(tx.getSenderAddress().toBytes());
    if (tx.to) {
      proto.setTo(tx.to.toBytes());
    }

    proto.setType(tx.type);
    proto.setNonce(Number(tx.nonce));
    if (tx.data) {
      proto.setInput(tx.data);
    }

    proto.setChainid(Number(tx.chainId));
    proto.setValue(hexToBytes("0x" + tx.value.toString(16)));
    proto.setGas(Number(tx.gasLimit));
    proto.setGasPrice(Number(tx.gasPrice));
    proto.setV(Number(tx.v!));
    proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
    proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
  } else if (isFeeMarketEIP1559Tx(tx)) {
    proto.setHash(tx.hash());
    proto.setFrom(tx.getSenderAddress().toBytes());
    if (tx.to) {
      proto.setTo(tx.to.toBytes());
    }

    proto.setType(tx.type);
    proto.setNonce(Number(tx.nonce));
    if (tx.data) {
      proto.setInput(tx.data);
    }

    proto.setChainid(Number(tx.chainId));
    proto.setValue(hexToBytes("0x" + tx.value.toString(16)));
    proto.setGas(Number(tx.gasLimit));
    proto.setMaxFee(Number(tx.maxFeePerGas));
    proto.setPriorityFee(Number(tx.maxPriorityFeePerGas));
    proto.setV(Number(tx.v!));
    proto.setR(hexToBytes("0x" + tx.r!.toString(16)));
    proto.setS(hexToBytes("0x" + tx.s!.toString(16)));
  }

  return proto;
}

// ============== BLOCK CONVERSION UTILS ==============

export function fromProtoExecutionHeader(
  block: eth.ExecutionPayloadHeader
): ExecutionPayloadHeader {
  return {
    hash: bytesToHex(block.getBlockHash()),
    parentHash: bytesToHex(block.getParentHash()),
    number: block.getBlockNumber(),
    timestamp: block.getTimestamp(),
    prevRandao: bytesToHex(block.getPrevRandao()),
    stateRoot: bytesToHex(block.getStateRoot()),
    receiptRoot: bytesToHex(block.getReceiptsRoot()),
    feeRecipient: bytesToHex(block.getFeeRecipient()),
    extraData: bytesToHex(block.getExtraData()),
    gasLimit: ethers.BigNumber.from(block.getGasLimit()),
    gasUsed: ethers.BigNumber.from(block.getGasUsed()),
    logsBloom: bytesToHex(block.getLogsBloom()),
    baseFeePerGas: ethers.BigNumber.from(block.getBaseFeePerGas()),
  };
}

export function fromProtoBeaconBlock(
  block: eth.CompactBeaconBlock
): BeaconBlock {
  const body = block.getBody()!;

  const beacon: BeaconBlock = {
    slot: block.getSlot(),
    proposerIndex: block.getProposerIndex(),
    parentRoot: bytesToHex(block.getParentRoot()),
    stateRoot: bytesToHex(block.getStateRoot()),
    body: {
      randaoReveal: bytesToHex(body.getRandaoReveal()),
      eth1Data: {
        depositRoot: bytesToHex(body.getEth1Data()!.getDepositRoot()),
        depositCount: body.getEth1Data()!.getDepositCount(),
        blockHash: bytesToHex(body.getEth1Data()!.getBlockHash()),
      },
      graffiti: bytesToHex(body.getGraffiti()),
      proposerSlashingsList: body
        .getProposerSlashingsList()
        .map(fromProtoProposerSlashing),
      attesterSlashingsList: body
        .getAttesterSlashingsList()
        .map(fromProtoAttesterSlashing),
      attestationsList: body.getAttestationsList().map(fromProtoAttestation),
      depositsList: body.getDepositsList().map(fromProtoDeposit),
      voluntaryExitsList: body
        .getVoluntaryExitsList()
        .map(fromProtoVoluntaryExit),
      syncAggregate: {
        syncCommitteeBits: bytesToHex(
          body.getSyncAggregate()!.getSyncCommitteeBits()
        ),
        syncCommitteeSignature: bytesToHex(
          body.getSyncAggregate()!.getSyncCommitteeSignature()
        ),
      },
      blsToExecutionChangesList: body
        .getBlsToExecutionChangesList()
        .map(fromProtoBlsToExecutionChange),
    },
  };

  return beacon;
}

function fromProtoProposerSlashing(
  slashing: eth.ProposerSlashing
): ProposerSlashing {
  const h1 = slashing.getHeader1()!;
  const h2 = slashing.getHeader2()!;
  const m1 = h1.getMessage()!;
  const m2 = h2.getMessage()!;

  return {
    header1: {
      message: {
        slot: m1.getSlot(),
        proposerIndex: m1.getProposerIndex(),
        parentRoot: bytesToHex(m1.getParentRoot()),
        stateRoot: bytesToHex(m1.getStateRoot()),
        bodyRoot: bytesToHex(m1.getBodyRoot()),
      },
      signature: h1.getSignature(),
    },
    header2: {
      message: {
        slot: m2.getSlot(),
        proposerIndex: m2.getProposerIndex(),
        parentRoot: bytesToHex(m2.getParentRoot()),
        stateRoot: bytesToHex(m2.getStateRoot()),
        bodyRoot: bytesToHex(m2.getBodyRoot()),
      },
      signature: h2.getSignature(),
    },
  };
}

function fromProtoAttesterSlashing(
  slashing: eth.AttesterSlashing
): AttesterSlashing {
  const a1 = slashing.getAttestation1()!;
  const a2 = slashing.getAttestation2()!;
  const d1 = a1.getData()!;
  const d2 = a2.getData()!;

  return {
    attestation1: {
      attestingIndicesList: a1.getAttestingIndicesList(),
      data: {
        slot: d1.getSlot(),
        index: d1.getIndex(),
        beaconBlockRoot: bytesToHex(d1.getBeaconBlockRoot()),
        source: {
          epoch: d1.getSource()!.getEpoch(),
          root: bytesToHex(d1.getSource()!.getRoot()),
        },
        target: {
          epoch: d1.getTarget()!.getEpoch(),
          root: bytesToHex(d1.getTarget()!.getRoot()),
        },
      },
      signature: a1.getSignature(),
    },
    attestation2: {
      attestingIndicesList: a2.getAttestingIndicesList(),
      data: {
        slot: d2.getSlot(),
        index: d2.getIndex(),
        beaconBlockRoot: bytesToHex(d2.getBeaconBlockRoot()),
        source: {
          epoch: d2.getSource()!.getEpoch(),
          root: bytesToHex(d2.getSource()!.getRoot()),
        },
        target: {
          epoch: d2.getTarget()!.getEpoch(),
          root: bytesToHex(d2.getTarget()!.getRoot()),
        },
      },
      signature: a2.getSignature(),
    },
  };
}

function fromProtoAttestation(attestation: eth.Attestation) {
  const data = attestation.getData()!;
  return {
    aggregationBits: bytesToHex(attestation.getAggregationBits()),
    data: {
      slot: data.getSlot(),
      index: data.getIndex(),
      beaconBlockRoot: bytesToHex(data.getBeaconBlockRoot()),
      source: {
        epoch: data.getSource()!.getEpoch(),
        root: bytesToHex(data.getSource()!.getRoot()),
      },
      target: {
        epoch: data.getTarget()!.getEpoch(),
        root: bytesToHex(data.getTarget()!.getRoot()),
      },
    },
    signature: attestation.getSignature(),
  };
}

function fromProtoDeposit(deposit: eth.Deposit): Deposit {
  const data = deposit.getData()!;
  return {
    proofList: deposit.getProofList(),
    data: {
      pubkey: bytesToHex(data.getPubkey()),
      withdrawalCredentials: bytesToHex(data.getWithdrawalCredentials()),
      amount: data.getAmount(),
      signature: data.getSignature(),
    },
  };
}

function fromProtoVoluntaryExit(exit: eth.SignedVoluntaryExit) {
  const message = exit.getMessage()!;
  return {
    message: {
      epoch: message.getEpoch(),
      validatorIndex: message.getValidatorIndex(),
    },
    signature: exit.getSignature(),
  };
}

function fromProtoBlsToExecutionChange(change: eth.SignedBLSToExecutionChange) {
  return {
    message: {
      validatorIndex: change.getMessage()!.getValidatorIndex(),
      fromBlsPubkey: bytesToHex(change.getMessage()!.getFromBlsPubkey()),
      toExecutionAddress: bytesToHex(
        change.getMessage()!.getToExecutionAddress()
      ),
    },
    signature: bytesToHex(change.getSignature()),
  };
}
