import { network } from "hardhat";

const { viem } = await network.connect();

const [walletClient] = await viem.getWalletClients();

console.log("Wallet:", walletClient.account.address);
console.log("Wallet client loaded successfully");