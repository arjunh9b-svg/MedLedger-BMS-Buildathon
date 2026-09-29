import { network } from "hardhat";
import fs from "node:fs";
import http from "node:http";

const CONTRACT_ADDRESS =
  "0x3e3f9bdd41314341e5c10508cdab3a6c2893bb48";

const abi = JSON.parse(
  fs.readFileSync("abi/MedLedger.json", "utf-8")
);

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient();

const accounts = await walletClient.getAddresses();

if (accounts.length === 0) {
  throw new Error("No MST wallet account available");
}

const account = accounts[0];

const contract = {
  address: CONTRACT_ADDRESS,
  abi,
} as const;

async function handleRequest(body: any) {
  if (body.command === "register") {
    const hash = await walletClient.writeContract({
      ...contract,
      functionName: "registerCertificate",
      args: [
        body.equipmentId,
        body.certificateHash,
      ],
      account,
    });

    return {
      success: true,
      equipmentId: body.equipmentId,
      transactionHash: hash,
    };
  }

  if (body.command === "verify") {
    const result = await publicClient.readContract({
      ...contract,
      functionName: "getCertificate",
      args: [body.equipmentId],
    });

    return {
      success: true,
      equipmentId: body.equipmentId,
      storedHash: result[0],
      exists: result[2],
      submittedHash: body.certificateHash,
      matched:
        result[2] &&
        result[0].toLowerCase() ===
          body.certificateHash.toLowerCase(),
    };
  }

  return {
    success: false,
    error: "Unknown command",
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST" || req.url !== "/blockchain") {
    res.statusCode = 404;
    res.end(JSON.stringify({
      success: false,
      error: "Not found",
    }));
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      const result = await handleRequest(data);

      res.statusCode = result.success ? 200 : 400;
      res.end(JSON.stringify(result));

    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({
        success: false,
        error: String(error),
      }));
    }
  });
});

server.listen(5050, "127.0.0.1", () => {
  console.log("=================================");
  console.log("MedLedger MST Bridge");
  console.log("Account:", account);
  console.log("Contract:", CONTRACT_ADDRESS);
  console.log("HTTP: http://127.0.0.1:5050/blockchain");
  console.log("Status: READY");
  console.log("=================================");
});