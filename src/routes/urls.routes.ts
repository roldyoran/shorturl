// src/routes/urls.routes.ts
import { Hono } from 'hono';
import { getShortUrlInfoHandler, redirectToOriginalUrl } from '@/controllers/urls.controller';
import { AppContext } from '@/models/bindings';
import { validateOriginalURL } from '@/controllers/urls.zValidator';
import { apiKeyMiddleware } from '@/middlewares/apikey.middlewares';

const app = new Hono<AppContext>();

// Ruta de bienvenida a la API
app.get('/', (c) => {
    return c.text('¡Hola! Bienvenido a la API de acortador de URLs creada por roldyoran!');
});

// Ruta para obtener información de un URL acortado
app.get('/info', validateOriginalURL, apiKeyMiddleware, getShortUrlInfoHandler);

// Get Info Short URL Handler
app.get('/:short_url', redirectToOriginalUrl);

// app.post("/shorten", zValidator("json", originalURLFormatSchema), getShortUrlInfoHandler);
// app.post('/', addTodo);
// Más rutas aquí (PUT, DELETE)...

// URL not found handler
app.notFound((c) => {
    return c.json({ error: 'URL not found' }, 404);
});

export default app;
