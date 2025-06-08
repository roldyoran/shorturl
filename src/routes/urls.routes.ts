// src/routes/urls.routes.ts
import { Hono } from 'hono';
import {
    getInfoShortUrlHandler,
    postShortenUrlHandler,
    redirectToOriginalUrl,
} from '@/controllers/urls.controller';
import { AppContext } from '@/models/bindings';
import { validateOriginalURL } from '@/controllers/urls.zValidator';
import { apiKeyMiddleware } from '@/middlewares/apikey.middlewares';

const app = new Hono<AppContext>();

// Ruta de bienvenida a la API
app.get('/', (c) => {
    return c.text('¡Hola! Bienvenido a la API de acortador de URLs creada por roldyoran!');
});

// Ruta para obtener información de un URL acortado
app.get('/info/:short_url{^[a-zA-Z0-9]{1,14}$}', apiKeyMiddleware, getInfoShortUrlHandler);

// Ruta para acortar una URL
app.post('/shorten', apiKeyMiddleware, validateOriginalURL, postShortenUrlHandler);

// Get Info Short URL Handler
app.get('/:short_url{^[a-zA-Z0-9]{1,14}$}', redirectToOriginalUrl);


// URL not found handler
app.notFound((c) => {
    return c.text('URL not found', 404);
});

export default app;
