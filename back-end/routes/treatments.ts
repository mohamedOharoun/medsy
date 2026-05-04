import { Hono } from "hono";
import { treatmentsService } from "../services/treatments.service";

const treatmentsRouter = new Hono();

const requireFields = (obj: any, fields: string[]) => fields.find((f) => !obj[f]);

// GET: Obtener tratamientos
treatmentsRouter.get("/", (c) => {
  const data = treatmentsService.getAll();
  return c.json({ success: true, data });
});

// POST: Añadir un tratamiento
treatmentsRouter.post("/", async (c) => {
  const body = await c.req.json();
  const missing = requireFields(body, ["medicationName", "dosage", "frequency"]);
  if (missing) return c.json({ success: false, error: `Missing: ${missing}` }, 400);

  const data = treatmentsService.create(body);
  return c.json({ success: true, data }, 201);
});

// PUT: Editar un tratamiento
treatmentsRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  treatmentsService.update(id, body);
  return c.json({ success: true, message: "Treatment updated" });
});

// DELETE: Eliminar un tratamiento
treatmentsRouter.delete("/:id", (c) => {
  const id = c.req.param("id");
  treatmentsService.delete(id);
  return c.json({ success: true, message: "Treatment deleted" });
});

export default treatmentsRouter;