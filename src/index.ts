// src/index.ts
import { Hono } from 'hono';
import urlsRoutes from '@/routes/urls.routes';

const app = new Hono();

// Monta las rutas
app.route('/getinfo', urlsRoutes);

// Ejemplo para Cloudflare Workers
export default app;