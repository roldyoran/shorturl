import { useUrlStore } from "@/stores/urlStore";
import { toast } from "vue-sonner";
import { shortenUrlRequest, getApiBaseUrl } from "@/api/http";
import type { UrlInfoResponse } from "@/api/types";

/**
 * Composable para manejar el acortamiento de URLs
 */
export const useUrlShortener = () => {
	const urlStore = useUrlStore();

	const shortenUrl = async (
		originalUrl: string,
		customHash?: string,
	): Promise<{ success: boolean; shortUrl?: string }> => {
		// Verificar si puede usar el servicio
		if (!urlStore.canUseService) {
			toast.error(
				"Límite de intentos alcanzado",
				{
					description: "Ha alcanzado el límite máximo de 3 intentos. Los intentos se reinician cada 24 horas.",
				}
			);
			return { success: false };
		}

		try {
			urlStore.isLoading = true;

			// Validar hash personalizado si se proporciona
			if (customHash && !/^[a-zA-Z0-9-_]+$/.test(customHash)) {
				toast.error(
					"Hash inválido",
					{
						description: "El hash personalizado solo puede contener letras, números, guiones y guiones bajos.",
					}
				);
				return { success: false };
			}

			// Realizar petición a la API
			const data: UrlInfoResponse = await shortenUrlRequest(
				originalUrl,
				customHash,
			);

			if (data && data.shortCode) {
				// Decrementar intentos (solo para no-admin)
				urlStore.decrementAttempts();

				// Agregar URL al store
				urlStore.addUrl(data.originalUrl, data.shortCode);

				// Mostrar notificación de éxito
				toast.success(
					"¡URL acortada exitosamente!",
					{
						description: `URL corta: ${getApiBaseUrl().replace(/\/$/, "")}/${data.shortCode}`,
					}
				);

				return { success: true, shortUrl: data.shortCode };
			} else {
				toast.error("Respuesta inválida", {
					description: "La respuesta de la API no es válida."
				});
				return { success: false };
			}
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || "Error al acortar la URL";
			toast.error("Error en el servidor", {
				description: errorMessage
			});
			return { success: false };
		} finally {
			urlStore.isLoading = false;
		}
	};

	return {
		shortenUrl,
		canUseService: urlStore.canUseService,
		remainingAttempts: urlStore.userSession.remainingAttempts,
		isAdmin: urlStore.userSession.isAdmin,
		isLoading: urlStore.isLoading,
	};
};
