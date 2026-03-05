import { Hono } from "hono";
import { corsMiddleware } from "@/utils/cors-middleware";
import { checkEnvMiddleware, type Bindings } from "@/utils/context";
import { v1Router } from "@/presentation/http/v1";
import { redirectRoutes } from "@/presentation/http/redirect";
import { onError } from "@/utils/error-handler";

// Crear la instancia principal de la aplicación
const app = new Hono<{ Bindings: Bindings }>();

// Middleware para verificar la presencia de variables de entorno y emitir warnings
app.use("*", checkEnvMiddleware);

// Middleware para configurar CORS
app.use("*", corsMiddleware());

app.get("/", (c) => {
	return c.json({
		message: "Bienvenido al acortador de URLs",
		version: "1.0.0",
	});
});

// Rutas versionadas — añade app.route("/v2", v2Router) cuando sea necesario
app.route("/v1", v1Router);

// Redirección directa: GET /:shortCode → URL original
app.route("/", redirectRoutes);

// Manejador global de errores — punto único para modificar el formato de todos los errores
app.onError(onError);

export default app;
