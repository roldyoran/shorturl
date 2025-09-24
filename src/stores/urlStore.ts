import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Interfaces
export interface UrlItem {
	original: string;
	short: string;
	date: string;
}

export interface UserSession {
	remainingAttempts: number;
	isAdmin: boolean;
	sessionId: string;
	lastReset: string;
}

// Store de URLs
export const useUrlStore = defineStore("urlStore", () => {
	// Estado reactivo
	const savedUrls = ref<UrlItem[]>([]);
	const userSession = ref<UserSession>({
		remainingAttempts: 3,
		isAdmin: false,
		sessionId: generateSessionId(),
		lastReset: new Date().toISOString(),
	});

	// Estado de la aplicación
	const isLoading = ref(false);
	const currentTab = ref<"shorten" | "info" | "myurls" | "list">("shorten");

	// Getters computados
	const hasRemainingAttempts = computed(
		() => userSession.value.remainingAttempts > 0,
	);
	const urlCount = computed(() => savedUrls.value.length);
	const canUseService = computed(
		() => userSession.value.isAdmin || hasRemainingAttempts.value,
	);

	// Funciones de utilidad
	function generateSessionId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	function shouldResetAttempts(): boolean {
		const lastReset = new Date(userSession.value.lastReset);
		const now = new Date();
		const hoursSinceReset =
			(now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
		return hoursSinceReset >= 24; // Reset cada 24 horas
	}

	// Acciones del store
	function loadUserSession() {
		try {
			const stored = localStorage.getItem("userSession");
			if (stored) {
				const parsedSession = JSON.parse(stored) as UserSession;

				// Verificar si necesita reset por tiempo
				if (shouldResetAttempts()) {
					resetAttempts();
				} else {
					userSession.value = {
						...parsedSession,
						sessionId: parsedSession.sessionId || generateSessionId(),
					};
				}
			} else {
				// Nueva sesión
				saveUserSession();
			}
		} catch (error) {
			console.error("Error loading user session:", error);
			resetUserSession();
		}
	}

	function saveUserSession() {
		try {
			localStorage.setItem("userSession", JSON.stringify(userSession.value));
		} catch (error) {
			console.error("Error saving user session:", error);
		}
	}

	function resetUserSession() {
		userSession.value = {
			remainingAttempts: 3,
			isAdmin: false,
			sessionId: generateSessionId(),
			lastReset: new Date().toISOString(),
		};
		saveUserSession();
	}

	function resetAttempts() {
		userSession.value.remainingAttempts = 3;
		userSession.value.lastReset = new Date().toISOString();
		saveUserSession();
	}

	function decrementAttempts() {
		if (userSession.value.isAdmin) return true;

		if (userSession.value.remainingAttempts > 0) {
			userSession.value.remainingAttempts--;
			saveUserSession();
			return true;
		}
		return false;
	}

	function setAdminStatus(isAdmin: boolean, apiKey?: string) {
		// Verificar si tiene la API key correcta (opcional)
		if (isAdmin && apiKey) {
			const envApiKey = import.meta.env.VITE_API_KEY;
			if (envApiKey && apiKey === envApiKey) {
				userSession.value.isAdmin = true;
				userSession.value.remainingAttempts = 999; // Unlimited para admins
			} else {
				userSession.value.isAdmin = false;
			}
		} else {
			userSession.value.isAdmin = isAdmin;
			if (isAdmin) {
				userSession.value.remainingAttempts = 999;
			}
		}
		saveUserSession();
	}

	// Funciones para URLs guardadas
	function loadSavedUrls() {
		try {
			const stored = localStorage.getItem("savedUrls");
			if (stored) {
				const parsedUrls: UrlItem[] = JSON.parse(stored);
				// Remover duplicados y ordenar por fecha
				savedUrls.value = removeDuplicateUrls(parsedUrls).sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				);
			}
		} catch (error) {
			console.error("Error loading saved URLs:", error);
			savedUrls.value = [];
		}
	}

	function addUrl(original: string, short: string) {
		const newUrl: UrlItem = {
			original,
			short,
			date: new Date().toISOString(),
		};

		// Agregar al inicio del array
		savedUrls.value.unshift(newUrl);

		// Mantener solo las últimas 50 URLs
		if (savedUrls.value.length > 50) {
			savedUrls.value = savedUrls.value.slice(0, 50);
		}

		// Remover duplicados
		savedUrls.value = removeDuplicateUrls(savedUrls.value);

		saveSavedUrls();
	}

	function removeUrl(original: string, short: string) {
		savedUrls.value = savedUrls.value.filter(
			(url) => !(url.original === original && url.short === short),
		);
		saveSavedUrls();
	}

	function clearAllUrls() {
		savedUrls.value = [];
		saveSavedUrls();
	}

	function saveSavedUrls() {
		try {
			localStorage.setItem("savedUrls", JSON.stringify(savedUrls.value));
		} catch (error) {
			console.error("Error saving URLs:", error);
		}
	}

	function removeDuplicateUrls(urlList: UrlItem[]): UrlItem[] {
		const seen = new Set<string>();
		return urlList.filter((url) => {
			if (seen.has(url.original)) return false;
			seen.add(url.original);
			return true;
		});
	}

	// Funciones de navegación
	function setCurrentTab(tab: typeof currentTab.value) {
		currentTab.value = tab;
	}

	// Función de inicialización
	function initialize() {
		loadUserSession();
		loadSavedUrls();
	}

	// Funciones para debugging (solo desarrollo)
	function getDebugInfo() {
		return {
			session: userSession.value,
			urlCount: savedUrls.value.length,
			canUse: canUseService.value,
			shouldReset: shouldResetAttempts(),
		};
	}

	return {
		// Estado
		savedUrls,
		userSession,
		isLoading,
		currentTab,

		// Getters
		hasRemainingAttempts,
		urlCount,
		canUseService,

		// Acciones - Sesión de usuario
		loadUserSession,
		saveUserSession,
		resetUserSession,
		resetAttempts,
		decrementAttempts,
		setAdminStatus,

		// Acciones - URLs
		loadSavedUrls,
		addUrl,
		removeUrl,
		clearAllUrls,

		// Acciones - Navegación
		setCurrentTab,

		// Inicialización
		initialize,

		// Debug (solo desarrollo)
		getDebugInfo,
	};
});
