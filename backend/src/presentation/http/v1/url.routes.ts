import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Bindings } from "@/utils/context";
import { createDb } from "@/db";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import { GetAllUrlsUseCase } from "@/application/url/get-all-urls.usecase";
import { GetUrlByShortCodeUseCase } from "@/application/url/get-url-by-shortcode.usecase";
import { CreateUrlUseCase } from "@/application/url/create-url.usecase";
import { shortCodeSchema, createUrlSchema } from "@/utils/schemas";
import { NotFoundError } from "@/domain/app-error";
import { validationHook } from "@/infrastructure/http/error-handler";

// Adaptador primario: rutas HTTP que traducen requests a llamadas de casos de uso
const urlRoutes = new Hono<{ Bindings: Bindings }>();

// GET /v1/urls — lista todas las URLs
urlRoutes.get("/", async (c) => {
	const db = createDb(c.env.DB);
	const repo = new UrlRepository(db);
	const useCase = new GetAllUrlsUseCase(repo);
	const urls = await useCase.execute();
	return c.json(urls);
});

// POST /v1/urls — crea una nueva URL corta
// Body: { originalUrl: string, shortCode?: string }
urlRoutes.post(
	"/",
	zValidator("json", createUrlSchema, validationHook),
	async (c) => {
		const { originalUrl, shortCode } = c.req.valid("json");
		const db = createDb(c.env.DB);
		const repo = new UrlRepository(db);
		const useCase = new CreateUrlUseCase(repo);
		const created = await useCase.execute({ originalUrl, shortCode });
		return c.json(created, 201);
	},
);

// GET /v1/urls/:shortCode — obtiene una URL por su código corto
urlRoutes.get(
	"/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const db = createDb(c.env.DB);
		const repo = new UrlRepository(db);
		const useCase = new GetUrlByShortCodeUseCase(repo);
		const url = await useCase.execute(shortCode);
		if (!url) {
			throw new NotFoundError("URL no encontrada");
		}
		return c.json(url);
	},
);

export { urlRoutes };
