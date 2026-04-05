import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import type { Bindings } from "@/utils/context";

const swaggerRoutes = new Hono<{ Bindings: Bindings }>();

swaggerRoutes.get("/swagger", swaggerUI({ url: "/openapi.json" }));

export { swaggerRoutes };
