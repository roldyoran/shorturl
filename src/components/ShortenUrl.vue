<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden bg-zinc-950/60">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-zinc-500/10 to-teal-500/10 pointer-events-none"></div>
    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-7 h-7 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-300">Acortar URL</h2>
      </div>
      <p class="text-sm font-medium my-4" :class="remainingAttempts === 0 ? 'text-pink-400/90' : 'text-yellow-400/90'" my-4>Puede probar el acortador un máximo de 3 veces. -- Intentos restantes: {{ remainingAttempts }}</p>

      <form @submit.prevent="shortenUrl" class="space-y-6">
        <div>
          <label for="original-url" class="block text-sm font-medium text-cyan-100 mb-2">URL Original</label>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative w-full">
              <input 
                type="url" 
                id="original-url" 
                v-model="originalUrl" 
                placeholder="https://ejemplo.com/pagina-muy-larga-para-acortar"
                required 
                class="w-full px-4 py-3 bg-zinc-900-80 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-cyan-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
              >
              <button 
                type="button"
                @click="showHashField = !showHashField"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                :title="showHashField ? 'Ocultar hash personalizado' : 'Mostrar hash personalizado'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'rotate-180': showHashField }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button 
              type="submit" 
              :disabled="loading"
              class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <span v-if="!loading">Acortar</span>
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          <div v-if="showHashField" class="mt-4 animate-fadeIn">
            <label for="custom-hash" class="block text-sm font-medium text-cyan-100 mb-2">Hash Personalizado (opcional)</label>
            <input 
              type="text" 
              id="custom-hash" 
              v-model="customHash" 
              placeholder="Ingrese un hash personalizado"
              pattern="^[a-zA-Z0-9]+$"
              class="w-full px-4 py-3 bg-zinc-900-80 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-cyan-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
            >
            <p class="text-xs text-cyan-400/70 mt-1">Solo se permiten letras y números</p>
          </div>
          <p v-if="error" class="text-cyan-300 mt-2 text-sm animate-pulse">{{ error }}</p>
        </div>
      </form>

      <div v-if="shortUrl" class="mt-8 bg-zinc-800/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-inner border border-white/10">
  <p class="text-sm font-medium text-cyan-100 mb-3">URL Acortada:</p>
  
  <!-- Desktop: flex horizontal -->
  <div class="hidden sm:flex items-center justify-between bg-zinc-950/50 p-3 rounded-md border border-white/10 gap-3">  
    <span class="break-all px-2 text-cyan-300 font-mono text-sm lg:text-base flex-1 min-w-0">
      {{ urlbase + shortUrl }}
    </span>
    <button 
      @click="copyToClipboard('https://shorturl.roldyoran.workers.dev/'+shortUrl)" 
      class="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-xs font-semibold rounded-md duration-200 transform hover:scale-105 transition-all whitespace-nowrap border border-zinc-600 hover:border-zinc-500"
    >
      <Copy class="w-4 h-4" />
      Copiar
    </button>
  </div>

  <!-- Mobile: stack vertical -->
  <div class="sm:hidden bg-zinc-950/50 p-3 rounded-md border border-white/10 space-y-3">
    <div class="break-all px-2 text-cyan-300 font-mono text-sm">
      {{ urlbase + shortUrl }}
    </div>
    <button 
      @click="copyToClipboard('https://shorturl.roldyoran.workers.dev/'+shortUrl)" 
      class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-zinc-100 text-sm font-semibold rounded-md duration-200 transition-all border border-zinc-600 hover:border-zinc-500"
    >
      <Copy class="w-4 h-4" />
      Copiar URL
    </button>
  </div>
  
  <!-- <p v-if="copySuccess" class="text-cyan-400 text-sm mt-2">¡URL copiada al portapapeles!</p> -->
</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Copy } from "lucide-vue-next";
import { shortenUrlRequest } from "../api/http";
import { copyToClipboard } from "../utils/copyUrl";
import type { UrlInfoResponse } from "../api/types";

const originalUrl = ref<string>("");
const shortUrl = ref<string>("");
const error = ref<string>("");
const loading = ref<boolean>(false);
const copySuccess = ref<boolean>(false);
const showHashField = ref<boolean>(false);
const customHash = ref<string>("");
const urlbase = "https://shorturl.roldyoran.workers.dev/";
const remainingAttempts = ref<number>(
	Number(localStorage.getItem("remainingAttempts")) || 3,
);

function decrementAttempts() {
	if (remainingAttempts.value > 0) {
		remainingAttempts.value -= 1;
		localStorage.setItem(
			"remainingAttempts",
			remainingAttempts.value.toString(),
		);
	}
}

const emit = defineEmits<(e: "url-shortened") => void>();

async function shortenUrl() {
	error.value = "";
	shortUrl.value = "";
	copySuccess.value = false;
	if (!originalUrl.value) {
		error.value = "Por favor ingresa una URL.";
		return;
	}
	if (remainingAttempts.value <= 0) {
		error.value = "Ha alcanzado el límite de intentos.";
		return;
	}
	loading.value = true;
	try {
		if (customHash.value && !/^[a-zA-Z0-9-_]+$/.test(customHash.value)) {
			error.value = "El hash personalizado solo puede contener letras, números, guiones y guiones bajos.";
			return;
		}
		const data: UrlInfoResponse = await shortenUrlRequest(originalUrl.value, customHash.value);
		if (data && data.short_url) {
			shortUrl.value = data.short_url;
			saveUrl(data.original_url, data.short_url);
			decrementAttempts();
			emit("url-shortened");
		} else {
			error.value = "Respuesta inválida de la API.";
		}
	} catch (e: any) {
		error.value = e?.response?.data?.message || "Error al acortar la URL.";
	} finally {
		loading.value = false;
	}
}

function saveUrl(original: string, short: string) {
	try {
		const urls = JSON.parse(localStorage.getItem("savedUrls") || "[]");
		urls.unshift({ original, short, date: new Date().toISOString() });
		localStorage.setItem("savedUrls", JSON.stringify(urls.slice(0, 50)));
	} catch (e) {
		console.error("Error al guardar URL en localStorage:", e);
	}
}
</script>