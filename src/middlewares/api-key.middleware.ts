/**
 * Middleware para validar la API key
 * Verifica que la solicitud incluya una API key válida
 */
import { Next } from 'hono';
import { AppContext } from '../types';

/**
 * Verifica que la solicitud incluya una API key válida
 * @param c Contexto de la aplicación
 * @param next Función para continuar con el siguiente middleware
 */
export const apiKeyMiddleware = async (c: AppContext, next: Next) => {
  if (c.req.header('x-api-key') !== c.env.API_KEY) {
    return c.json({ error: 'API key inválida' }, 401);
  }
  await next();
};