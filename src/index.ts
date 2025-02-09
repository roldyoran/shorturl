import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { UserService } from '@/db/db';
import { urlFormatSchema } from '@/schemas';
import { generateRandomCode } from '@/utils';
import { html } from '@/html/not-found';

export type Bindings = {
   DB: D1Database;
   API_KEY: string;
};

// Extender el tipo de contexto para incluir `userService`
type AppContext = {
   Bindings: Bindings;
   Variables: {
      userService: UserService;
   };
};

const app = new Hono<AppContext>();

// Middleware global para CORS
app.use('*', async (c, next) => {
   // Configura las cabeceras CORS
   c.header('Access-Control-Allow-Origin', '*');
   c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
   c.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

   // Si es una solicitud OPTIONS, responde inmediatamente
   if (c.req.method === 'OPTIONS') {
      return c.json(204);
   }

   // Continúa con la siguiente función middleware o el manejador de la ruta
   await next();
});

// Middleware para inicializar UserService
app.use('*', async (c, next) => {
   // Inicializa UserService y lo asigna al contexto
   const userService = new UserService(c.env.DB);
   c.set('userService', userService);
   await next();
});

// Endpoint principal de bienvenida
app.get('/', (c) => {
   return c.text('Hello User, welcome to the Hono Short URL API created by roldyoran!');
});

// Endpoint para acortar una URL
app.post('/shorten', zValidator('json', urlFormatSchema), async (c) => {
   if (c.req.header('x-api-key') !== c.env.API_KEY) {
      return c.json({ error: 'Invalid API key' }, 401);
   }

   const { original_url } = c.req.valid('json');
   const normalizedUrl = original_url.toLowerCase().replace(/\/$/, '');

   const userService = c.get('userService');
   const existingShortUrl = await userService.getShortUrl(normalizedUrl);
   if (existingShortUrl) {
      return c.json({
         short_url: existingShortUrl[0].short_url,
         original_url: normalizedUrl,
      });
   }

   let shortUrl = generateRandomCode();
   while (await userService.verifyURL(shortUrl)) {
      shortUrl = generateRandomCode();
   }

   const insertSuccess = await userService.insertUrls(shortUrl, normalizedUrl);
   if (!insertSuccess) {
      return c.json({ error: 'Error inserting URL' }, 500);
   }

   return c.json({ short_url: shortUrl, original_url: normalizedUrl });
});

// Endpoint para obtener información de una URL acortada
app.get('/info/:short_url{^[a-zA-Z0-9]{1,9}$}', async (c) => {
   if (c.req.header('x-api-key') !== c.env.API_KEY) {
      return c.json({ error: 'Invalid API key' }, 401);
   }

   const shortUrl = c.req.param('short_url');
   const userService = c.get('userService');
   const result = await userService.getUrlInfo(shortUrl);

   if (!result) {
      return c.json({ error: 'Short URL not found' }, 404);
   }

   return c.json(result);
});

// Endpoint para redirigir a la URL original a partir de una URL acortada
app.get('/:short_url{^[a-zA-Z0-9]{1,9}$}', async (c) => {
   const shortUrl = c.req.param('short_url');
   const userService = c.get('userService');
   const result = await userService.fetchOriginalUrl(shortUrl);
   if (!result) {
      return c.html(html);
   }
   const parsed = urlFormatSchema.safeParse({ original_url: result.original_url });
   if (!parsed.success) {
      return c.json({ error: 'Invalid URL format' }, 400);
   }
   // increaseClicks(c.env, shortUrl);
   await userService.incrementClicks(shortUrl);
   // return c.json({ original_ufasdfarl: parsed.data.original_url });
   return c.redirect(parsed.data.original_url, 301); // Redirección permanente
});


app.notFound((c) => {
   return c.html(html);
 })

export default app;
