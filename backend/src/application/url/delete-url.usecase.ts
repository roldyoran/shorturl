import type { UrlEntity } from "@/domain/url/url.entity";
import type { UrlRepositoryPort } from "@/domain/url/url.repository.port";
import { AppError } from "@/utils/app-error";

export class UrlNotFoundError extends AppError {
	constructor(shortCode: string) {
		super(
			`No existe una URL con el shortCode "${shortCode}"`,
			404,
			"URL_NOT_FOUND",
		);
	}
}

export class DeleteUrlUseCase {
	constructor(private readonly urlRepository: UrlRepositoryPort) {}

	async execute(shortCode: string): Promise<UrlEntity> {
		const deleted = await this.urlRepository.deleteByShortCode(shortCode);
		if (!deleted) {
			throw new UrlNotFoundError(shortCode);
		}
		return deleted;
	}
}
