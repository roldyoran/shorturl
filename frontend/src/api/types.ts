export interface UrlInfoResponse {
	visits: number;
	createdAt: string;
	originalUrl: string;
	shortCode: string;
	id: number;
}

export interface UrlItem {
	originalUrl: string;
	shortCode: string;
	createdAt: string;
	visits: number;
	id: number;
}
