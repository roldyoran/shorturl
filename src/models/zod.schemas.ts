// src/models/bindings.ts

import { z } from "zod"


/**
 * Esquema para validar el formato de URL
 * Acepta solo URLs que comiencen con http:// o https://
 */
export const originalURLFormatSchema = z.object({
   original_url: z
      .string()
      .url({ message: 'La URL debe tener un formato válido' })
      .min(1, { message: 'La URL no puede estar vacía' })
      .max(2048, { message: 'La URL no puede exceder los 2048 caracteres' })
      .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
         message: 'La URL debe comenzar con http:// o https://',
      })
});
