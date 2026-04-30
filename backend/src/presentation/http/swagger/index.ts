import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import type { Bindings } from "@/utils/context";

const swaggerRoutes = new Hono<{ Bindings: Bindings }>();

swaggerRoutes.get("/docs", swaggerUI({ url: "/openapi.json" }));

export { swaggerRoutes };
