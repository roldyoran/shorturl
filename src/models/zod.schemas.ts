// src/models/bindings.ts

import { z } from "zod";

/**
 * Esquema para validar el formato de URL
 * Acepta solo URLs que comiencen con http:// o https://
 */
export const originalURLFormatSchema = z.object({
	original_url: z
		.string()
		.url({ message: "La URL debe tener un formato válido" })
		.min(1, { message: "La URL no puede estar vacía" })
		.max(2048, { message: "La URL no puede exceder los 2048 caracteres" })
		.refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
			message: "La URL debe comenzar con http:// o https://",
		}),
	// hash, osea una url corta personalizada opcional
	hash: z
		.string()
		.min(1, { message: "El hash debe tener al menos 1 carácter" })
		.max(14, { message: "El hash no puede exceder los 14 caracteres" })
		.regex(/^[a-zA-Z0-9]+$/, {
			message: "El hash solo puede contener letras y números",
		})
		.refine((hash) => /^[a-zA-Z0-9]+$/.test(hash), {
			message: "El texto solo debe contener letras y números",
		})
		.optional(),
});
