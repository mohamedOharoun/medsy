import { simplifyMedicationName } from "./utils/name-simplifier.ts";

const testName = "ABACAVIR/LAMIVUDINA DR. REDDYS 600 MG/300 MG COMPRIMIDOS RECUBIERTOS CON PELICULA EFG";
const simple = simplifyMedicationName(testName);
console.log(`Original: ${testName}`);
console.log(`Simple:   ${simple}`);
