import axios from "axios";

// Obtiene la URL base y la API Key desde localStorage
export function getAxiosInstance() {
	const baseURL =
		localStorage.getItem("apiUrl") || "https://shorturl.roldyoran.workers.dev";
	const apiKey = import.meta.env.VITE_API_KEY || "";

	//   console.log('Base URL:', baseURL)
	//   console.log('API Key:', apiKey)

	return axios.create({
		baseURL,
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
		},
	});
}

// Función para acortar URL
export async function shortenUrlRequest(originalUrl: string, hash?: string) {
	const axiosInstance = getAxiosInstance();
	if (hash) {
		const response = await axiosInstance.post("/shorten", {
			original_url: originalUrl,
			hash: hash,
		});
		return response.data;
	} else {
		const response = await axiosInstance.post("/shorten", {
			original_url: originalUrl,
		});
		return response.data;
	}
}

// Función para obtener información de una URL corta
export async function getUrlInfoRequest(shortCode: string) {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.get(`/info/${shortCode}`);
	return response.data;
}

// Funcion para obtener todas las URLs
export async function getUrlsRequest() {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.get("/urls");
	return response;
}
