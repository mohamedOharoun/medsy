import { simplifyMedicationName } from "../utils/name-simplifier";

export const toTreatmentDTO = (raw: any) => ({
  ...raw,
  medicationName: simplifyMedicationName(raw.medicationName) || raw.medicationName,
  times: raw.times ? JSON.parse(raw.times) : [],
});