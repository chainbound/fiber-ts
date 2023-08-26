"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromProtoBeaconBlock = exports.fromProtoExecutionHeader = exports.toProtoTx = exports.fromProtoTx = exports.hexToBytes = exports.bytesToHex = void 0;
const util_1 = require("@ethereumjs/util");
const ethers_1 = require("ethers");
const tx_1 = require("@ethereumjs/tx");
const eth_pb_1 = __importDefault(require("../protobuf/eth_pb"));
// ============= TYPE CONVERSION UTILS ==============
function bytesToHex(b) {
    return "0x" + Buffer.from(b).toString("hex");
}
exports.bytesToHex = bytesToHex;
function hexToBytes(str) {
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
exports.hexToBytes = hexToBytes;
// ============== TRANSACTION CONVERSION UTILS ==============
function convertAccessList(list) {
    return list.map((tuple) => {
        return {
            address: "0x" + Buffer.from(tuple.getAddress()).toString("hex"),
            storageKeys: tuple.getStorageKeysList().map((key) => "0x" + Buffer.from(key).toString("hex")),
        };
    });
}
function fromProtoTx(tx) {
    let value = 0n;
    if (tx.getValue()) {
        value = BigInt("0x" + Buffer.from(tx.getValue()).toString("hex"));
    }
    let to;
    if (tx.getTo().length !== 0) {
        to = new util_1.Address(Buffer.from(tx.getTo()));
    }
    else {
        to = util_1.Address.zero();
    }
    switch (tx.getType()) {
        case tx_1.TransactionType.Legacy:
            return tx_1.LegacyTransaction.fromTxData({
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
        case tx_1.TransactionType.AccessListEIP2930:
            return tx_1.AccessListEIP2930Transaction.fromTxData({
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
        case tx_1.TransactionType.FeeMarketEIP1559:
            return tx_1.FeeMarketEIP1559Transaction.fromTxData({
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
    return tx_1.TransactionFactory.fromTxData({});
}
exports.fromProtoTx = fromProtoTx;
// WARNING: if transaction is legacy, it will only work on Ethereum mainnet.
function toProtoTx(tx) {
    const proto = new eth_pb_1.default.Transaction();
    if ((0, tx_1.isLegacyTx)(tx)) {
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
        proto.setV(Number(tx.v));
        proto.setR(hexToBytes("0x" + tx.r.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s.toString(16)));
    }
    else if ((0, tx_1.isAccessListEIP2930Tx)(tx)) {
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
        proto.setV(Number(tx.v));
        proto.setR(hexToBytes("0x" + tx.r.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s.toString(16)));
    }
    else if ((0, tx_1.isFeeMarketEIP1559Tx)(tx)) {
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
        proto.setV(Number(tx.v));
        proto.setR(hexToBytes("0x" + tx.r.toString(16)));
        proto.setS(hexToBytes("0x" + tx.s.toString(16)));
    }
    return proto;
}
exports.toProtoTx = toProtoTx;
// ============== BLOCK CONVERSION UTILS ==============
function fromProtoExecutionHeader(block) {
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
        gasLimit: ethers_1.ethers.BigNumber.from(block.getGasLimit()),
        gasUsed: ethers_1.ethers.BigNumber.from(block.getGasUsed()),
        logsBloom: bytesToHex(block.getLogsBloom()),
        baseFeePerGas: ethers_1.ethers.BigNumber.from(block.getBaseFeePerGas()),
    };
}
exports.fromProtoExecutionHeader = fromProtoExecutionHeader;
function fromProtoBeaconBlock(block) {
    const body = block.getBody();
    const beacon = {
        slot: block.getSlot(),
        proposerIndex: block.getProposerIndex(),
        parentRoot: bytesToHex(block.getParentRoot()),
        stateRoot: bytesToHex(block.getStateRoot()),
        body: {
            randaoReveal: bytesToHex(body.getRandaoReveal()),
            eth1Data: {
                depositRoot: bytesToHex(body.getEth1Data().getDepositRoot()),
                depositCount: body.getEth1Data().getDepositCount(),
                blockHash: bytesToHex(body.getEth1Data().getBlockHash()),
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
                syncCommitteeBits: bytesToHex(body.getSyncAggregate().getSyncCommitteeBits()),
                syncCommitteeSignature: bytesToHex(body.getSyncAggregate().getSyncCommitteeSignature()),
            },
            blsToExecutionChangesList: body
                .getBlsToExecutionChangesList()
                .map(fromProtoBlsToExecutionChange),
        },
    };
    return beacon;
}
exports.fromProtoBeaconBlock = fromProtoBeaconBlock;
function fromProtoProposerSlashing(slashing) {
    const h1 = slashing.getHeader1();
    const h2 = slashing.getHeader2();
    const m1 = h1.getMessage();
    const m2 = h2.getMessage();
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
function fromProtoAttesterSlashing(slashing) {
    const a1 = slashing.getAttestation1();
    const a2 = slashing.getAttestation2();
    const d1 = a1.getData();
    const d2 = a2.getData();
    return {
        attestation1: {
            attestingIndicesList: a1.getAttestingIndicesList(),
            data: {
                slot: d1.getSlot(),
                index: d1.getIndex(),
                beaconBlockRoot: bytesToHex(d1.getBeaconBlockRoot()),
                source: {
                    epoch: d1.getSource().getEpoch(),
                    root: bytesToHex(d1.getSource().getRoot()),
                },
                target: {
                    epoch: d1.getTarget().getEpoch(),
                    root: bytesToHex(d1.getTarget().getRoot()),
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
                    epoch: d2.getSource().getEpoch(),
                    root: bytesToHex(d2.getSource().getRoot()),
                },
                target: {
                    epoch: d2.getTarget().getEpoch(),
                    root: bytesToHex(d2.getTarget().getRoot()),
                },
            },
            signature: a2.getSignature(),
        },
    };
}
function fromProtoAttestation(attestation) {
    const data = attestation.getData();
    return {
        aggregationBits: bytesToHex(attestation.getAggregationBits()),
        data: {
            slot: data.getSlot(),
            index: data.getIndex(),
            beaconBlockRoot: bytesToHex(data.getBeaconBlockRoot()),
            source: {
                epoch: data.getSource().getEpoch(),
                root: bytesToHex(data.getSource().getRoot()),
            },
            target: {
                epoch: data.getTarget().getEpoch(),
                root: bytesToHex(data.getTarget().getRoot()),
            },
        },
        signature: attestation.getSignature(),
    };
}
function fromProtoDeposit(deposit) {
    const data = deposit.getData();
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
function fromProtoVoluntaryExit(exit) {
    const message = exit.getMessage();
    return {
        message: {
            epoch: message.getEpoch(),
            validatorIndex: message.getValidatorIndex(),
        },
        signature: exit.getSignature(),
    };
}
function fromProtoBlsToExecutionChange(change) {
    return {
        message: {
            validatorIndex: change.getMessage().getValidatorIndex(),
            fromBlsPubkey: bytesToHex(change.getMessage().getFromBlsPubkey()),
            toExecutionAddress: bytesToHex(change.getMessage().getToExecutionAddress()),
        },
        signature: bytesToHex(change.getSignature()),
    };
}
