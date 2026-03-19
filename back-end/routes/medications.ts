import { Hono } from "hono";
import { db } from "../db/db";
import { simplifyMedicationName } from "../utils/name-simplifier";

const medicationsRouter = new Hono();

// --- Filtro de medicamentos ---
medicationsRouter.get('/search', (c) => {
    const activeSubstance = c.req.query('substance') || '';
    const commercialName = c.req.query('name') || '';
    const administration = c.req.query('administration') || '';

    let query = "SELECT * FROM medicamentos WHERE 1=1";
    const params: any[] = [];

    if (activeSubstance) {
        query += " AND principiosActivos LIKE ?";
        params.push(`%${activeSubstance}%`);
    }
    if (commercialName) {
        query += " AND nombre LIKE ?";
        params.push(`%${commercialName}%`);
    }
    if (administration) {
        query += " AND viasAdministracion LIKE ?";
        params.push(`%${administration}%`);
    }

    query += " LIMIT 50"; // limit results to prevent huge payload

    try {
        const stmt = db.prepare(query);
        const results: any[] = stmt.all(...params);

        const simplifiedResults = results.map(m => ({
            ...m,
            nombreOriginal: m.nombre,
            nombre: simplifyMedicationName(m.nombre) || m.nombre
        }));

        return c.json({ success: true, data: simplifiedResults });
    } catch (e) {
        return c.json({ success: false, error: "Database error" }, 500);
    }
});

export default medicationsRouter;
