/**
 * Middleware para validar la API key
 * Verifica que la solicitud incluya una API key válida
 */
import { Next } from 'hono';
import { Context } from 'hono';
import { AppContext } from '@/models/bindings';

/**
 * Verifica que la solicitud incluya una API key válida
 * @param c Contexto de la aplicación
 * @param next Función para continuar con el siguiente middleware
 * @returns Response en caso de error o el resultado del siguiente middleware
 */
export const apiKeyMiddleware = async (c: Context<AppContext>, next: Next): Promise<Response | void> => {
    // Verifica si la API key está presente en el encabezado de la solicitud
    if (!c.req.header('x-api-key')) {
        return c.json({ error: 'API key is required' }, 401);
    }
    if (c.req.header('x-api-key') !== c.env.API_KEY) {
        return c.json({ error: 'Invalid API key' }, 401);
    }
    await next();
};
