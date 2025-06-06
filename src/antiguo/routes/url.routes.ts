/**
 * Rutas para el acortador de URLs
 * Define los endpoints de la API sin incluir la lógica de negocio
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { urlFormatSchema } from '../schemas';
import { apiKeyMiddleware } from '../middlewares';
import { AppContext } from '../types';
import {
    welcomeController,
    shortenUrlController,
    getUrlInfoController,
    redirectToOriginalUrlController,
} from '../controllers/url.controller';

// Crear instancia de Hono para las rutas de URL
const urlRouter = new Hono<AppContext>();

/**
 * Endpoint principal de bienvenida
 */
urlRouter.get('/', welcomeController);

/**
 * Endpoint para acortar una URL
 * Requiere autenticación con API key
 */
urlRouter.post(
    '/shorten',
    apiKeyMiddleware,
    zValidator('json', urlFormatSchema),
    shortenUrlController,
);

/**
 * Endpoint para obtener información de una URL acortada
 * Requiere autenticación con API key
 */
urlRouter.get('/info/:short_url{^[a-zA-Z0-9]{1,9}$}', apiKeyMiddleware, getUrlInfoController);

/**
 * Endpoint para redirigir a la URL original a partir de una URL acortada
 */
urlRouter.get('/:short_url{^[a-zA-Z0-9]{1,14}$}', redirectToOriginalUrlController);

export default urlRouter;
