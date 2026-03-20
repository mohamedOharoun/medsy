import { Database } from "bun:sqlite";

const db = new Database("medicamentos.sqlite");

try {
  db.run("ALTER TABLE treatments ADD COLUMN times TEXT");
  console.log("Success: Added column 'times' to treatments table.");
} catch (e: any) {
  if (e.message.includes("duplicate column name")) {
    console.log("Warning: Column 'times' already exists.");
  } else {
    console.error("Error adding column 'times':", e.message);
  }
}
