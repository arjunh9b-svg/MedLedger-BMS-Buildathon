import { verifyCertificate } from "../services/medledger.js";

const equipmentId = "EQ-00043";

const modifiedHash =
  "0x4444444444444444444444444444444444444444444444444444444444444444";

const result = await verifyCertificate(equipmentId, modifiedHash);

console.log("Equipment:", equipmentId);
console.log("Modified hash verification:", result);
