// src/index.ts
import { Hono } from "hono";
import { corsMiddleware } from "@/middlewares/cors.middlewares";
import urlsRoutes from "@/routes/urls.routes";

const app = new Hono();

// Configuración básica (como la original)
app.use(corsMiddleware());

// Monta las rutas
app.route("/", urlsRoutes);

// Ejemplo para Cloudflare Workers
export default app;
