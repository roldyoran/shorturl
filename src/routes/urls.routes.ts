// src/routes/urls.routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getShortUrlInfoHandler } from '@/controllers/urls.controller';
import { AppContext } from '@/models/bindings';
import { originalURLFormatSchema } from '@/models/zod.schemas';

const app = new Hono<AppContext>();


app.get('/', (c) => {
  return c.json({ message: 'Welcome to the URL Shortener API' });   
});

app.get('/getinfo',  zValidator("json", originalURLFormatSchema), getShortUrlInfoHandler);
// app.post('/', addTodo);
// Más rutas aquí (PUT, DELETE)...

export default app;