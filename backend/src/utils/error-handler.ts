import type { Context } from "hono";
import { AppError, ValidationError } from "@/utils/app-error";

/**
 * Formato estándar de respuesta de error.
 * Para cambiar la estructura de todos los errores de la API, modifica solo este tipo.
 */
export type ApiErrorResponse = {
	success: false;
	error: {
		code: string;
		message: string;
		statusCode: number;
	};
};

/**
 * Genera una respuesta HTTP de error estandarizada.
 * Usado tanto por el onError global como por middleware que necesita responder antes de lanzar.
 */
export function errorResponse(c: Context, error: AppError): Response {
	return c.json<ApiErrorResponse>(
		{
			success: false,
			error: {
				code: error.code,
				message: error.message,
				statusCode: error.statusCode,
			},
		},
		error.statusCode as Parameters<typeof c.json>[1],
	);
}

/**
 * Manejador global de errores para Hono (app.onError).
 * Todos los errores no capturados en rutas o middleware llegan aquí.
 * Los AppError se formatean con errorResponse; el resto se convierte en 500.
 */
// biome-ignore lint/suspicious/noExplicitAny: Hono onError acepta any
export function onError(error: Error, c: Context): Response {
	if (error instanceof AppError) {
		return errorResponse(c, error);
	}

	console.error("[UNHANDLED ERROR]", error);

	return c.json<ApiErrorResponse>(
		{
			success: false,
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Error interno del servidor",
				statusCode: 500,
			},
		},
		500,
	);
}

/**
 * Hook de validación para zValidator.
 * Uso: zValidator("json", schema, validationHook)
 * Estandariza los errores de validación de Zod con el mismo formato que el resto de la API.
 */
// biome-ignore lint/suspicious/noExplicitAny: zValidator hook acepta tipos genéricos
export function validationHook(result: any, c: Context): Response | void {
	if (!result.success) {
		const messages = result.error.issues
			// biome-ignore lint/suspicious/noExplicitAny: Zod issue type
			.map((i: any) => i.message)
			.join("; ");
		return errorResponse(c, new ValidationError(messages));
	}
}
