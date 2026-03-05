import { describe, it, expect } from "bun:test";
import {
	AppError,
	UnauthorizedError,
	NotFoundError,
	ValidationError,
} from "@/utils/app-error";

describe("AppError", () => {
	it("debe asignar message, statusCode y code correctamente", () => {
		const error = new AppError("algo falló", 500, "INTERNAL_ERROR");

		expect(error.message).toBe("algo falló");
		expect(error.statusCode).toBe(500);
		expect(error.code).toBe("INTERNAL_ERROR");
	});

	it("debe ser instancia de Error", () => {
		const error = new AppError("msg", 500, "CODE");

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(AppError);
	});

	it("debe asignar el name al nombre de la clase", () => {
		const error = new AppError("msg", 500, "CODE");

		expect(error.name).toBe("AppError");
	});
});

describe("UnauthorizedError", () => {
	it("debe tener statusCode 401 y code UNAUTHORIZED", () => {
		const error = new UnauthorizedError();

		expect(error.statusCode).toBe(401);
		expect(error.code).toBe("UNAUTHORIZED");
	});

	it("debe usar el mensaje por defecto si no se especifica", () => {
		const error = new UnauthorizedError();

		expect(error.message).toBe("No autorizado");
	});

	it("debe aceptar un mensaje personalizado", () => {
		const error = new UnauthorizedError("Token expirado");

		expect(error.message).toBe("Token expirado");
	});

	it("debe ser instancia de AppError", () => {
		expect(new UnauthorizedError()).toBeInstanceOf(AppError);
	});
});

describe("NotFoundError", () => {
	it("debe tener statusCode 404 y code NOT_FOUND", () => {
		const error = new NotFoundError();

		expect(error.statusCode).toBe(404);
		expect(error.code).toBe("NOT_FOUND");
	});

	it("debe usar el mensaje por defecto si no se especifica", () => {
		const error = new NotFoundError();

		expect(error.message).toBe("Recurso no encontrado");
	});

	it("debe aceptar un mensaje personalizado", () => {
		const error = new NotFoundError("URL no encontrada");

		expect(error.message).toBe("URL no encontrada");
	});

	it("debe ser instancia de AppError", () => {
		expect(new NotFoundError()).toBeInstanceOf(AppError);
	});
});

describe("ValidationError", () => {
	it("debe tener statusCode 400 y code VALIDATION_ERROR", () => {
		const error = new ValidationError("campo requerido");

		expect(error.statusCode).toBe(400);
		expect(error.code).toBe("VALIDATION_ERROR");
	});

	it("debe asignar el mensaje correctamente", () => {
		const error = new ValidationError("Debe ser una URL válida");

		expect(error.message).toBe("Debe ser una URL válida");
	});

	it("debe ser instancia de AppError", () => {
		expect(new ValidationError("msg")).toBeInstanceOf(AppError);
	});
});
