import { getCertificateHistory } from "../services/medledger.js";

const equipmentId = "EQ-00043";

const history = await getCertificateHistory(equipmentId);

console.log("Equipment:", equipmentId);

console.log("\nRegistered:");
console.log(history.registered);

console.log("\nUpdated:");
console.log(history.updated);

console.log("\nVerified:");
console.log(history.verified);
