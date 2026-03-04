import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Bindings } from "@/utils/context";
import { createDb } from "@/db";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import { RedirectUrlUseCase } from "@/application/url/redirect-url.usecase";
import { shortCodeSchema } from "@/utils/schemas";
import { NotFoundError } from "@/utils/app-error";
import { validationHook } from "@/utils/error-handler";

// Adaptador primario: redirección directa por shortCode en la raíz
const redirectRoutes = new Hono<{ Bindings: Bindings }>();

// GET /:shortCode — redirige al usuario a la URL original e incrementa el contador de visitas
redirectRoutes.get(
	"/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const db = createDb(c.env.DB);
		const repo = new UrlRepository(db);
		const useCase = new RedirectUrlUseCase(repo);
		const url = await useCase.execute(shortCode);
		if (!url) {
			throw new NotFoundError(`No existe una URL para el código "${shortCode}"`);
		}
		return c.redirect(url.originalUrl, 302);
	},
);

export { redirectRoutes };
