import { Hono } from "hono";
import type { Bindings } from "@/utils/context";

const openapiRoutes = new Hono<{ Bindings: Bindings }>();

openapiRoutes.get("/openapi.json", (c) => {
	return c.json({
		openapi: "3.0.0",
		info: {
			title: "ShortURL API",
			version: "1.0.0",
			description:
				"API para acortar URLs desarrollada con Hono, TypeScript y Cloudflare Workers",
		},
		servers: [
			{
				url: "/",
				description: "Servidor local",
			},
		],
		paths: {
			"/v1/urls": {
				get: {
					summary: "Listar todas las URLs",
					description: "Retorna todas las URLs almacenadas",
					responses: {
						"200": {
							description: "Lista de URLs",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: {
											type: "object",
											properties: {
												id: { type: "string" },
												originalUrl: { type: "string" },
												shortCode: { type: "string" },
												createdAt: { type: "string" },
												visits: { type: "integer" },
											},
										},
									},
								},
							},
						},
					},
				},
				post: {
					summary: "Crear una URL corta",
					description:
						"Crea una nueva URL corta. Si se provee un shortCode personalizado, debe ser único. Si la URL original ya existe, retorna la existente.",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["originalUrl"],
									properties: {
										originalUrl: { type: "string", format: "uri" },
										shortCode: {
											type: "string",
											minLength: 1,
											maxLength: 6,
											pattern: "^[a-z0-9]+$",
										},
									},
								},
							},
						},
					},
					responses: {
						"201": {
							description: "URL creada",
						},
						"400": {
							description: "Error de validación",
						},
						"409": {
							description: "ShortCode ya en uso",
						},
					},
				},
			},
			"/v1/urls/{shortCode}": {
				get: {
					summary: "Obtener URL por código corto",
					description: "Retorna la información de una URL específica",
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: {
								type: "string",
								pattern: "^[a-z0-9]{1,6}$",
							},
						},
					],
					responses: {
						"200": {
							description: "URL encontrada",
						},
						"404": {
							description: "URL no encontrada",
						},
					},
				},
			},
			"/v1/admin/urls/{shortCode}": {
				delete: {
					summary: "Eliminar una URL",
					description:
						"Elimina una URL por su código corto. Requiere autenticación.",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: {
								type: "string",
								pattern: "^[a-z0-9]{1,6}$",
							},
						},
					],
					responses: {
						"200": {
							description: "URL eliminada",
						},
						"401": {
							description: "No autorizado",
						},
						"404": {
							description: "URL no encontrada",
						},
					},
				},
			},
			"/v1/admin/urls": {
				delete: {
					summary: "Eliminar todas las URLs",
					description:
						"Elimina todas las URLs almacenadas. Requiere autenticación.",
					security: [{ bearerAuth: [] }],
					responses: {
						"200": {
							description: "Todas las URLs eliminadas",
						},
						"401": {
							description: "No autorizado",
						},
					},
				},
			},
			"/{shortCode}": {
				get: {
					summary: "Redireccionar a URL original",
					description:
						"Redirige al código corto hacia la URL original e incrementa el contador de visitas",
					parameters: [
						{
							name: "shortCode",
							in: "path",
							required: true,
							schema: {
								type: "string",
								pattern: "^[a-z0-9]{1,6}$",
							},
						},
					],
					responses: {
						"302": {
							description: "Redirección",
						},
						"404": {
							description: "URL no encontrada",
						},
					},
				},
			},
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "API Key",
				},
			},
		},
	});
});

export { openapiRoutes };
