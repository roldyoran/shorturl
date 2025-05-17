/**
 * Punto de entrada principal para la aplicación de acortador de URLs
 * Configura la aplicación, middlewares y rutas siguiendo el patrón MVC
 */
import { Hono } from 'hono';
import { corsMiddleware, urlServiceMiddleware } from './middlewares';
import urlRouter from './routes/url.routes';
import { html } from './html/not-found';
import { AppContext } from './types';

// Crear la instancia principal de la aplicación
const app = new Hono<AppContext>();

// Aplicar middlewares globales
app.use('*', corsMiddleware);
app.use('*', urlServiceMiddleware as any);

// Montar las rutas de URL
app.route('/', urlRouter);

// Configurar página 404 para rutas no encontradas
app.notFound((c): Response => {
   return c.html(html);
});

export default app;
