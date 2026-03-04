import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Bindings } from "@/utils/context";
import { createDb } from "@/db";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import { DeleteUrlUseCase } from "@/application/url/delete-url.usecase";
import { DeleteAllUrlsUseCase } from "@/application/url/delete-all-urls.usecase";
import { shortCodeSchema } from "@/utils/schemas";
import { UnauthorizedError } from "@/utils/app-error";
import { validationHook } from "@/utils/error-handler";

const adminRoutes = new Hono<{ Bindings: Bindings }>();

// Middleware de autenticación: requiere header Authorization: Bearer <SERVICE_ADMIN_API_KEY>
adminRoutes.use("/*", async (c, next) => {
	const authHeader = c.req.header("Authorization");
	const apiKey = c.env.SERVICE_ADMIN_API_KEY;

	if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
		throw new UnauthorizedError();
	}

	await next();
});

// DELETE /v1/admin/urls/:shortCode — elimina una URL por su código corto
adminRoutes.delete(
	"/urls/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const db = createDb(c.env.DB);
		const repo = new UrlRepository(db);
		const useCase = new DeleteUrlUseCase(repo);
		const deleted = await useCase.execute(shortCode);
		return c.json(deleted);
	},
);

// DELETE /v1/admin/urls — elimina todas las URLs
adminRoutes.delete("/urls", async (c) => {
	const db = createDb(c.env.DB);
	const repo = new UrlRepository(db);
	const useCase = new DeleteAllUrlsUseCase(repo);
	await useCase.execute();
	return c.json({ message: "Todas las URLs han sido eliminadas" });
});

export { adminRoutes };
