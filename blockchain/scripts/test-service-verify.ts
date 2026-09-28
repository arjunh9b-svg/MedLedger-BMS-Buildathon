import { verifyCertificate } from "../services/medledger.js";

const equipmentId = "EQ-00043";

const certificateHash =
  "0x3333333333333333333333333333333333333333333333333333333333333333";

const result = await verifyCertificate(equipmentId, certificateHash);

console.log("Equipment:", equipmentId);
console.log("Verification result:", result);
