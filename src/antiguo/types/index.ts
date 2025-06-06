/**
 * Definiciones de tipos para la aplicación
 */
import { Hono } from 'hono';
import { UrlService } from '../services/url.service';

/**
 * Tipo para las variables de entorno de Cloudflare Workers
 */
export type Bindings = {
    DB: D1Database;
    API_KEY: string;
};

/**
 * Tipo para el contexto de la aplicación
 * Incluye las variables de entorno y los servicios
 */
export interface AppContext {
    get(arg0: string): unknown;
    redirect(original_url: string, arg1: number): Response | PromiseLike<Response>;
    json(
        errorResponse: ErrorResponse,
        arg1: number,
    ): void | Response | PromiseLike<void | Response>;
    env: any;
    req: any;
    Bindings: Bindings;
    Variables: {
        urlService: UrlService;
    };
}

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

/**
 * Interfaz para la respuesta de error
 */
export interface ErrorResponse {
    error: string;
}
