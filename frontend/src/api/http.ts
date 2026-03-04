import axios from "axios";

// Devuelve la URL base de la API, preferencia: env VITE_API_BASE_URL -> localStorage apiUrl -> fallback
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const stored = localStorage.getItem("apiUrl");
  return (envUrl && envUrl.length > 0 ? envUrl : stored) || "https://shorturl.roldyoran.workers.dev";
}

// Obtiene la instancia de axios configurada
export function getAxiosInstance() {
  const baseURL = getApiBaseUrl();
  const apiKey = import.meta.env.VITE_API_KEY || "";

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
