import { treatmentsRepository } from "../repositories/treatments.repository";
import { toTreatmentDTO } from "../mappers/treatments.mapper";

interface TreatmentInput {
  medicationName: string;
  dosage: string;
  frequency: string;
  times?: string[];
}

export class TreatmentsService {
  getAll() {
    return treatmentsRepository.findAll().map(toTreatmentDTO);
  }

  create(input: TreatmentInput) {
    const timesStr = input.times ? JSON.stringify(input.times) : null;
    const info = treatmentsRepository.create(
      input.medicationName,
      input.dosage,
      input.frequency,
      timesStr
    );
    return { id: info.lastInsertRowid, ...input };
  }

  update(id: string, input: Partial<TreatmentInput>) {
    const timesStr = input.times ? JSON.stringify(input.times) : null;
    treatmentsRepository.update(
      id,
      input.medicationName!,
      input.dosage!,
      input.frequency!,
      timesStr
    );
  }

  delete(id: string) {
    treatmentsRepository.delete(id);
  }
}

export const treatmentsService = new TreatmentsService();