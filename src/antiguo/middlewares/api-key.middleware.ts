/**
 * Middleware para validar la API key
 * Verifica que la solicitud incluya una API key válida
 */
import { Next } from 'hono';
import { AppContext, ErrorResponse } from '../types';

/**
 * Verifica que la solicitud incluya una API key válida
 * @param c Contexto de la aplicación
 * @param next Función para continuar con el siguiente middleware
 * @returns Response en caso de error o el resultado del siguiente middleware
 */
export const apiKeyMiddleware = async (c: AppContext, next: Next): Promise<Response | void> => {
   if (c.req.header('x-api-key') !== c.env.API_KEY) {
      const errorResponse: ErrorResponse = { error: 'API key inválida' };
      return c.json(errorResponse, 401);
   }
   await next();
};
