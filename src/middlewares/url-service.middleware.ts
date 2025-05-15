/**
 * Middleware para inicializar el servicio de URLs
 * Crea una instancia del servicio y la asigna al contexto
 */
import { Next } from 'hono';
import { UrlService } from '../services/url.service';
import { AppContext } from '../types';

/**
 * Inicializa el servicio de URLs y lo asigna al contexto
 * @param c Contexto de la aplicación
 * @param next Función para continuar con el siguiente middleware
 * @returns Promise<void>
 */
export const urlServiceMiddleware = async (c: AppContext, next: Next): Promise<void> => {
  // Inicializa UrlService y lo asigna al contexto
  const urlService = new UrlService(c.env.DB);
  c.set('urlService', urlService);
  await next();
};