import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Crea una instancia de Drizzle conectada al binding D1 del Worker.
 * Uso: const db = createDb(c.env.DB);
 */
export function createDb(d1Binding: D1Database) {
	return drizzle(d1Binding, { schema });
}

export type DrizzleDB = ReturnType<typeof createDb>;
