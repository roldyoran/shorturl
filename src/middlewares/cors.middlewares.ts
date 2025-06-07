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
// export const corsMiddleware = async (c: Context, next: Next): Promise<Response | void> => {
//     // Configura las cabeceras CORS
//     c.header('Access-Control-Allow-Origin', '*');
//     c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     c.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

//     // Si es una solicitud OPTIONS, responde inmediatamente
//     if (c.req.method === 'OPTIONS') {
//         return c.json(204);
//     }

//     // Continúa con la siguiente función middleware o el manejador de la ruta
//     await next();
// };

/**
 * Middleware para configurar CORS de forma segura y personalizable
 *
 * @param options Opciones de configuración para CORS
 * @returns Middleware de CORS configurado
 */
export const corsMiddleware = (options?: {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    maxAge?: number;
}) => {
    return async (c: Context, next: Next): Promise<Response | void> => {
        // Configuración por defecto
        const defaultOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
            allowedHeaders: ['Content-Type', 'x-api-key'],
            maxAge: 86400, // 24 horas
        };

        // Fusionar opciones personalizadas con las predeterminadas
        const config = { ...defaultOptions, ...options };

        // Configurar cabeceras CORS
        c.header(
            'Access-Control-Allow-Origin',
            Array.isArray(config.origin) ? config.origin.join(', ') : config.origin,
        );

        c.header('Access-Control-Allow-Methods', config.methods.join(', '));
        c.header('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
        c.header('Access-Control-Max-Age', config.maxAge.toString());

        // Para credenciales (si no es wildcard '*')
        if (config.origin !== '*') {
            c.header('Access-Control-Allow-Credentials', 'true');
        }

        // Manejar solicitud OPTIONS (preflight)
        if (c.req.method === 'OPTIONS') {
            c.status(204); // No Content
            return c.body(null);
        }

        await next();
    };
};
