/**
 * Clase base para todos los errores de la aplicación.
 * Centraliza el formato: statusCode HTTP + code de error legible por máquina.
 * Para añadir un nuevo tipo de error, extiende esta clase y define su statusCode y code.
 */
export class AppError extends Error {
	constructor(
		public override readonly message: string,
		public readonly statusCode: number,
		public readonly code: string,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

// ─── Errores genéricos reutilizables ────────────────────────────────────────

export class UnauthorizedError extends AppError {
	constructor(message = "No autorizado") {
		super(message, 401, "UNAUTHORIZED");
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Recurso no encontrado") {
		super(message, 404, "NOT_FOUND");
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400, "VALIDATION_ERROR");
	}
}
