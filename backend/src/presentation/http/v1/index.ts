import { Hono } from "hono";
import type { Bindings } from "@/utils/context";
import { urlRoutes } from "./url.routes";
import { adminRoutes } from "./admin.routes";

// Router agregador de la versión 1 de la API
// Añade aquí nuevas rutas de v1: v1Router.route("/posts", postRoutes), etc.
const v1Router = new Hono<{ Bindings: Bindings }>();

v1Router.route("/urls", urlRoutes);
v1Router.route("/admin", adminRoutes);

export { v1Router };
