import { descargarTodoElCatalogo } from "./sync";

let isRunning = false;

async function runSync() {
  if (isRunning) {
    console.log("[Cron] Sync already in progress, skipping this run.");
    return;
  }

  try {
    isRunning = true;
    console.log(`[Cron] Starting CIMA sync at ${new Date().toISOString()}`);
    await descargarTodoElCatalogo();
    console.log(`[Cron] Sync completed at ${new Date().toISOString()}`);
  } catch (e) {
    console.error("[Cron] Sync failed:", e);
  } finally {
    isRunning = false;
  }
}

export function startSyncCron() {
  console.log("[Cron] Hourly CIMA sync scheduled.");

  // Run immediately on startup, then every hour
  runSync();

  Bun.cron("0 * * * *", runSync);
}