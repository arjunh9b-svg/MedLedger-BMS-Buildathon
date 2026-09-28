import { getCertificate } from "../services/medledger.js";

const result = await getCertificate("EQ-00042");

console.log("Equipment: EQ-00042");
console.log("Stored hash:", result[0]);
console.log("Registered at:", result[1]);
console.log("Exists:", result[2]);
