import { registerCertificate, getCertificate } from "../services/medledger.js";

const equipmentId = "EQ-00043";

const certificateHash =
  "0x3333333333333333333333333333333333333333333333333333333333333333";

console.log("Registering:", equipmentId);

const txHash = await registerCertificate(
  equipmentId,
  certificateHash
);

console.log("Registration successful!");
console.log("Transaction:", txHash);

const result = await getCertificate(equipmentId);

console.log("Stored hash:", result[0]);
console.log("Exists:", result[2]);