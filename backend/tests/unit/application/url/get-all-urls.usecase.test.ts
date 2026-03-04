import { describe, it, expect, beforeEach } from "bun:test";
import { GetAllUrlsUseCase } from "@/application/url/get-all-urls.usecase";
import {
	createMockRepository,
	urlFixture,
	type MockedRepository,
} from "../../../__mocks__/url.repository.mock";
import type { UrlEntity } from "@/domain/url/url.entity";

describe("GetAllUrlsUseCase", () => {
	let repo: MockedRepository;
	let useCase: GetAllUrlsUseCase;

	beforeEach(() => {
		repo = createMockRepository();
		useCase = new GetAllUrlsUseCase(repo);
	});

	it("debe retornar todas las URLs del repositorio", async () => {
		const urls: UrlEntity[] = [
			urlFixture,
			{ ...urlFixture, id: 2, shortCode: "bun", originalUrl: "https://bun.sh" },
		];
		repo.findAll = () => Promise.resolve(urls);

		const result = await useCase.execute();

		expect(result).toEqual(urls);
		expect(result).toHaveLength(2);
	});

	it("debe retornar un array vacío cuando no hay URLs", async () => {
		repo.findAll = () => Promise.resolve([]);

		const result = await useCase.execute();

		expect(result).toEqual([]);
		expect(result).toHaveLength(0);
	});

	it("debe delegar la llamada al repositorio", async () => {
		await useCase.execute();

		expect(repo.findAll).toHaveBeenCalledTimes(1);
	});
});
