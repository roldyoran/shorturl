// src/routes/urls.routes.ts
import { Hono } from 'hono';
import { getShortUrlInfoHandler, redirectToOriginalUrl } from '@/controllers/urls.controller';
import { AppContext } from '@/models/bindings';
import { validateOriginalURL } from '@/controllers/urls.zValidator';
import { validateApiKey } from '@/controllers/api.controller';

const app = new Hono<AppContext>();

// Ruta de bienvenida a la API
app.get('/', (c) => {
    return c.json({ message: 'Welcome to the URL Shortener API' });
});

// Ruta para obtener información de un URL acortado
app.get('/info', validateOriginalURL, validateApiKey, getShortUrlInfoHandler);

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
