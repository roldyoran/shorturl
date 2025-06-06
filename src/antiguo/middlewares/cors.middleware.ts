/**
 * Middleware para configurar CORS
 * Permite solicitudes desde cualquier origen
 */
import { Context, Next } from 'hono';

/**
 * Configura las cabeceras CORS para permitir solicitudes desde cualquier origen
 * @param c Contexto de la solicitud
 * @param next Función para continuar con el siguiente middleware
 * @returns Response en caso de solicitud OPTIONS o void para otros métodos
 */
export const corsMiddleware = async (c: Context, next: Next): Promise<Response | void> => {
    // Configura las cabeceras CORS
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Authorization');

    // Si es una solicitud OPTIONS, responde inmediatamente
    if (c.req.method === 'OPTIONS') {
        return c.json(204);
    }

    // Continúa con la siguiente función middleware o el manejador de la ruta
    await next();
};
