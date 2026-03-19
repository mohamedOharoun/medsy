import { Hono } from "hono";
import { db } from "../db/db";
import { simplifyMedicationName } from "../utils/name-simplifier";

const treatmentsRouter = new Hono();

// GET: Obtener tratamientos
treatmentsRouter.get('/', (c) => {
    try {
        const results: any[] = db.prepare("SELECT * FROM treatments ORDER BY id DESC").all();
        
        const simplifiedResults = results.map(t => ({
            ...t,
            medicationName: simplifyMedicationName(t.medicationName) || t.medicationName
        }));

        return c.json({ success: true, data: simplifiedResults });
    } catch (e) {
        return c.json({ success: false, error: "Error fetching treatments" }, 500);
    }
});

// POST: Añadir un tratamiento
treatmentsRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { medicationName, dosage, frequency } = body;

        if (!medicationName || !dosage || !frequency) {
            return c.json({ success: false, error: "Missing required fields" }, 400);
        }

        const stmt = db.prepare("INSERT INTO treatments (medicationName, dosage, frequency) VALUES (?, ?, ?)");
        const info = stmt.run(medicationName, dosage, frequency);

        return c.json({ 
            success: true, 
            data: { id: info.lastInsertRowid, medicationName, dosage, frequency, userId: 1 }
        }, 201);
    } catch (e) {
        return c.json({ success: false, error: "Error adding treatment" }, 500);
    }
});

// PUT: Editar un tratamiento
treatmentsRouter.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { medicationName, dosage, frequency } = body;

        const updateStmt = db.prepare("UPDATE treatments SET medicationName = ?, dosage = ?, frequency = ? WHERE id = ?");
        updateStmt.run(medicationName, dosage, frequency, id);

        return c.json({ success: true, message: "Treatment updated" });
    } catch (e) {
        return c.json({ success: false, error: "Error updating treatment" }, 500);
    }
});

// DELETE: Eliminar un tratamiento
treatmentsRouter.delete('/:id', (c) => {
    try {
        const id = c.req.param('id');
        const delStmt = db.prepare("DELETE FROM treatments WHERE id = ?");
        delStmt.run(id);

        return c.json({ success: true, message: "Treatment deleted" });
    } catch (e) {
        return c.json({ success: false, error: "Error deleting treatment" }, 500);
    }
});

export default treatmentsRouter;
