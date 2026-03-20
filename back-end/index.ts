import { Hono } from "hono";
import { cors } from "hono/cors";
import { initDB } from "./db/db";
import medicationsRouter from "./routes/medications";
import treatmentsRouter from "./routes/treatments";
import { descargarTodoElCatalogo } from "./services/sync";

// Inicializar la DB y las tablas
initDB();

if (process.argv.includes("--sync")) {
    descargarTodoElCatalogo();
}

const app = new Hono();

// Permite peticiones de otros orígenes (CORS)
app.use('*', cors());

// Rutas de la API
app.route('/api/medications', medicationsRouter);
app.route('/api/treatments', treatmentsRouter);

// Handler por defecto
app.get('/', (c) => c.text('API Medsy is running!'));

export default {
    port: 3000,
    fetch: app.fetch,
};