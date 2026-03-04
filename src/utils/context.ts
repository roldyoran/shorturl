import type { MiddlewareHandler } from "hono";

// Bindings defines the environment variables/bindings available in Cloudflare Workers
export type Bindings = {
	// D1 database binding (nombre definido en wrangler.jsonc -> binding: "DB")
	DB: D1Database;
	CLOUFLARE_D1_DATABASES_BINDING: string;
	CLOUFLARE_D1_DATABASES_NAME: string;
	CLOUFLARE_D1_DATABASES_ID: string;
	SERVICE_ADMIN_API_KEY: string;
};

const ENV_KEYS: (keyof Bindings)[] = [
	"CLOUFLARE_D1_DATABASES_BINDING",
	"CLOUFLARE_D1_DATABASES_NAME",
	"CLOUFLARE_D1_DATABASES_ID",
	"SERVICE_ADMIN_API_KEY",
];

/**
 * Middleware que emite un warning por cada variable de entorno no encontrada
 */
export const checkEnvMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
}> = async (c, next) => {
	for (const key of ENV_KEYS) {
		if (!c.env[key]) {
			console.warn(`[WARNING] Variable de entorno no encontrada: ${key}`);
		}
	}
	await next();
};
