import { network } from "hardhat";

const { viem } = await network.connect();

const client = await viem.getPublicClient();

console.log("MST Chain ID:", await client.getChainId());
console.log("MST Block Number:", await client.getBlockNumber());