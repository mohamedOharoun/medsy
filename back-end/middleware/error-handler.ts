import type { Context } from "hono";

export const errorHandler = (err: Error, c: Context) => {
  return c.json({ success: false, error: err.message }, 500);
};