// src/models/bindings.ts
/**
 * Interfaz para los datos de URL almacenados en la base de datos
 */
export interface UrlData {
   short_url: string;
   original_url: string;
   created_at?: string;
   clicks?: number;
}

/**
 * Interfaz para la respuesta de URL acortada
 */
export interface ShortUrlResponse {
   short_url: string;
   original_url: string;
}

