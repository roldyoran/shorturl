import { defineStore } from "pinia";
import { ref } from "vue";

export interface ToastOptions {
	duration?: number;
	type?: "success" | "error" | "warning" | "info";
	description?: string;
}

// Store para el sistema de notificaciones
export const useNotificationStore = defineStore("notificationStore", () => {
	// Estado para controlar las notificaciones
	const notifications = ref<
		Array<{
			id: string;
			message: string;
			type: ToastOptions["type"];
			description?: string;
			timestamp: number;
		}>
	>([]);

	// Función para mostrar notificación
	function showToast(message: string, options: ToastOptions = {}) {
		const id = `toast-${Date.now()}-${Math.random()}`;

		notifications.value.push({
			id,
			message,
			type: options.type || "info",
			description: options.description,
			timestamp: Date.now(),
		});

		// Auto-remove después de la duración especificada
		setTimeout(() => {
			removeNotification(id);
		}, options.duration || 3000);

		return id;
	}

	// Funciones de conveniencia para diferentes tipos
	function showSuccess(message: string, description?: string) {
		return showToast(message, { type: "success", description });
	}

	function showError(message: string, description?: string) {
		return showToast(message, { type: "error", description });
	}

	function showWarning(message: string, description?: string) {
		return showToast(message, { type: "warning", description });
	}

	function showInfo(message: string, description?: string) {
		return showToast(message, { type: "info", description });
	}

	// Remover notificación específica
	function removeNotification(id: string) {
		const index = notifications.value.findIndex((n) => n.id === id);
		if (index > -1) {
			notifications.value.splice(index, 1);
		}
	}

	// Limpiar todas las notificaciones
	function clearAllNotifications() {
		notifications.value = [];
	}

	return {
		// Estado
		notifications,

		// Acciones
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		removeNotification,
		clearAllNotifications,
	};
});
