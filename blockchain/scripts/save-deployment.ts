import fs from "node:fs";
import path from "node:path";

const deployment = {
  contractName: "MedLedger",
  network: "MST Testnet",
  chainId: 91562037,
  contractAddress: "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48",
};

const dir = path.join(process.cwd(), "deployed");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(dir, "deployment.json"),
  JSON.stringify(deployment, null, 2)
);

console.log("Deployment information saved!");
console.log("Location: deployed/deployment.json");