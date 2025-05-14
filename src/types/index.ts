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
export type AppContext = {
  Bindings: Bindings;
  Variables: {
    urlService: UrlService;
  };
};