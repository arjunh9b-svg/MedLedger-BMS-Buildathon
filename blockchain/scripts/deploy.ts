import { network } from "hardhat";

const { viem } = await network.connect();

const ledger = await viem.deployContract("MedLedger");

console.log("MedLedger deployed!");
console.log("Contract address:", ledger.address);
