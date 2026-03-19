import { Database } from "bun:sqlite";

// 1. Configuración y base de datos
export const db = new Database("medicamentos.sqlite");

export function initDB() {
  // Crear tabla medicamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      nregistro TEXT PRIMARY KEY,
      nombre TEXT,
      estado TEXT,
      receta INTEGER,
      generico INTEGER,
      principiosActivos TEXT,
      excipientes TEXT,
      viasAdministracion TEXT,
      presentaciones TEXT,
      formaFarmaceutica TEXT,
      prospectoPdf TEXT,
      prospectoHtml TEXT
    )
  `);

  // Crear tabla treatments 
  db.run(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER DEFAULT 1,
      medicationName TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL
    )
  `);
}
