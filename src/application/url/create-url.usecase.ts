import type { UrlEntity, CreateUrlInput } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";
import { AppError } from "@/utils/app-error";

export class ShortCodeAlreadyExistsError extends AppError {
	constructor(shortCode: string) {
		super(
			`El shortCode "${shortCode}" ya está en uso`,
			409,
			"SHORT_CODE_ALREADY_EXISTS",
		);
	}
}

export class CreateUrlUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(input: CreateUrlInput): Promise<UrlEntity> {
		// Si la URL original ya existe, devolver la entrada existente
		const existingByUrl = await this.urlRepository.findByOriginalUrl(
			input.originalUrl,
		);
		if (existingByUrl) {
			return existingByUrl;
		}

		// Si se proporcionó un shortCode personalizado, verificar que no exista
		if (input.shortCode) {
			const existing = await this.urlRepository.findByShortCode(
				input.shortCode,
			);
			if (existing) {
				throw new ShortCodeAlreadyExistsError(input.shortCode);
			}
		}

		return this.urlRepository.create(input);
	}
}
