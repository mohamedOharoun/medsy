import { db } from "../db/db";

export class TreatmentsRepository {
  findAll() {
    return db.prepare("SELECT * FROM treatments ORDER BY id DESC").all() as any[];
  }

  create(medicationName: string, dosage: string, frequency: string, timesStr: string | null) {
    return db
      .prepare(
        "INSERT INTO treatments (medicationName, dosage, frequency, times) VALUES (?, ?, ?, ?)"
      )
      .run(medicationName, dosage, frequency, timesStr);
  }

  update (
    id: string,
    medicationName: string,
    dosage: string,
    frequency: string,
    timesStr: string | null
  ) {
    return db
    .prepare (
        "UPDATE treatments SET medicationName = ?, dosage = ?, frequency = ?, times = ? WHERE id = ?"
      )
    .run(medicationName, dosage, frequency, timesStr, id);
  }

  delete(id: string) {
    return db.prepare("DELETE FROM treatments WHERE id = ?").run(id);
  }
}

export const treatmentsRepository = new TreatmentsRepository();