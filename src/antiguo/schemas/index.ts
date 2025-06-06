/**
 * Esquemas de validación para la aplicación
 */
import { z } from 'zod';

/**
 * Esquema para validar el formato de URL
 * Acepta solo URLs que comiencen con http:// o https://
 */
export const urlFormatSchema = z.object({
    original_url: z
        .string()
        .url({ message: 'La URL debe tener un formato válido' })
        .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: 'La URL debe comenzar con http:// o https://',
        }),
});

/**
 * Esquema para validar el formato de URL corta
 * Acepta solo cadenas alfanuméricas de 1 a 9 caracteres
 */
export const shortUrlSchema = z.object({
    short_url: z
        .string()
        .min(1, { message: 'La URL corta debe tener al menos 1 carácter' })
        .max(9, { message: 'La URL corta no puede tener más de 9 caracteres' })
        .regex(/^[a-zA-Z0-9]+$/, { message: 'La URL corta solo puede contener letras y números' }),
});
