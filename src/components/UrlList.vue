<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-6 border border-white/10 overflow-hidden bg-zinc-950/60">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-zinc-900/10 to-teal-900/10 pointer-events-none"></div>
    <div class="relative z-10">
      <!-- Encabezado con barra de búsqueda -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
            <Globe class="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-300">URLs Disponibles</h2>
            <p class="text-xs sm:text-sm text-zinc-400 mt-1">Explora todos los enlaces acortados</p>
          </div>
        </div>
        
        <!-- Barra de búsqueda -->
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar URLs..."
            class="w-full pl-10 pr-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-xl text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
          />
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="text-center py-12 sm:py-16 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-xl border border-white/5">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-zinc-600 border-t-cyan-400 rounded-full animate-spin"></div>
            <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin" style="animation-delay: 0.3s; animation-direction: reverse;"></div>
          </div>
          <div class="space-y-2">
            <p class="text-lg sm:text-xl font-semibold text-white">Cargando URLs...</p>
            <p class="text-zinc-400 text-sm sm:text-base">Obteniendo tus enlaces acortados</p>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="shortUrls.length === 0" class="text-center py-12 sm:py-16 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-xl border border-white/5">
        <div class="p-3 sm:p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 inline-block mb-4">
          <Globe class="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>
        <p class="text-lg sm:text-xl font-semibold text-white mb-2 px-4">No hay URLs disponibles</p>
        <p class="text-zinc-400 px-4 text-sm sm:text-base">Las URLs aparecerán aquí una vez que sean creadas</p>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div v-else-if="filteredUrls.length === 0" class="text-center py-12 sm:py-16 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-xl border border-white/5">
        <div class="p-3 sm:p-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 inline-block mb-4 border border-amber-500/20">
          <Search class="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
        </div>
        <p class="text-lg sm:text-xl font-semibold text-white mb-2 px-4">No se encontraron resultados</p>
        <p class="text-zinc-400 px-4 text-sm sm:text-base">Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Lista de URLs -->
      <div v-else class="space-y-4 sm:space-y-6">
        <!-- Vista móvil: Cards -->
        <div class="block sm:hidden space-y-3">
          <div 
            v-for="url in filteredUrls" 
            :key="url.short_url"
            class="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-4 space-y-3"
          >
            <!-- URL corta -->
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <a 
                  :href="baseUrl + url.short_url" 
                  target="_blank" 
                  class="text-cyan-400 hover:text-cyan-300 hover:underline text-sm font-mono break-all flex items-center gap-2 group"
                >
                  <span class="break-all">{{ url.short_url }}</span>
                  <ExternalLink class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
              </div>
            </div>
            
            <!-- URL original -->
            <div class="flex items-start gap-2">
              <Globe class="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <a
                :href="url.original_url"
                target="_blank"
                class="text-zinc-300 text-sm break-all hover:underline hover:text-cyan-300 transition-colors"
                :title="url.original_url"
              >
                {{ url.original_url.length > 60 ? url.original_url.substring(0, 60) + '...' : url.original_url }}
              </a>
            </div>
            
            <!-- Fecha y clics -->
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 text-zinc-400">
                <Clock class="w-3 h-3 shrink-0" />
                <span>{{ formatDate(url.created_at) }}</span>
              </div>
              <div class="flex items-center gap-2 text-zinc-500">
                <span class="px-2 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-full text-xs">
                  {{ url.clicks || 0 }} clics
                </span>
              </div>
            </div>
            
            <!-- Acciones -->
            <div class="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
              <button 
                @click="copyToClipboard(baseUrl + url.short_url)"
                class="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-200"
                :title="'Copiar URL completa'"
              >
                <Copy class="w-4 h-4" />
              </button>
              <button 
                @click="copyToClipboard(url.short_url)"
                class="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200"
                :title="'Copiar código'"
              >
                <Hash class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Vista escritorio: Tabla -->
        <div class="hidden sm:block bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border-b border-white/10">
              <tr>
                <th scope="col" class="px-4 py-3 text-xs font-medium text-purple-300 uppercase tracking-wider text-left">URL</th>
                <th scope="col" class="px-4 py-3 text-xs font-medium text-purple-300 uppercase tracking-wider text-left">Fecha</th>
                <th scope="col" class="px-4 py-3 text-xs font-medium text-purple-300 uppercase tracking-wider text-left">Clics</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="url in filteredUrls"
                :key="url.short_url"
                class="hover:bg-white/5 transition-colors duration-200"
              >
                <td class="px-4 py-3 font-mono max-w-[50vw]">
                  <a 
                    :href="baseUrl + url.short_url" 
                    target="_blank" 
                    class="text-cyan-400 hover:text-cyan-300 hover:underline break-all flex items-center gap-2 group"
                  >
                    <span class="truncate">{{ url.short_url }}</span>
                    <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                  <div class="flex items-center space-x-2 text-zinc-300 truncate mt-1">
                    <Globe class="w-4 h-4 text-zinc-500 shrink-0" />
                    <a
                      :href="url.original_url"
                      target="_blank"
                      class="hover:underline transition-all hover:text-cyan-300 truncate"
                      :title="url.original_url"
                    >
                      {{ url.original_url.length > 50 ? url.original_url.substring(0, 50) + '...' : url.original_url }}
                    </a>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center space-x-2 text-zinc-400">
                    <Clock class="w-4 h-4 shrink-0" />
                    <span>{{ formatDate(url.created_at) }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-full text-xs text-teal-300">
                    {{ url.clicks || 0 }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end space-x-2">
                    <button 
                      @click="copyToClipboard(baseUrl + url.short_url)"
                      class="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-200 tooltip"
                      data-tooltip="Copiar URL completa"
                    >
                      <Copy class="w-4 h-4" />
                    </button>
                    <button 
                      @click="copyToClipboard(url.short_url)"
                      class="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200 tooltip"
                      data-tooltip="Copiar código"
                    >
                      <Hash class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Search,
  Copy,
  ExternalLink,
  Globe,
  Clock,
  Hash,
} from "lucide-vue-next";
import { copyToClipboard } from "../utils/copyUrl";
import { getUrlsRequest } from "../api/http";

interface Url {
  short_url: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

const baseUrl = "https://shorturl.roldyoran.workers.dev/";
const shortUrls = ref<Url[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);

const fetchShortUrls = async () => {
  try {
    isLoading.value = true;
    const response = await getUrlsRequest();
    shortUrls.value = response.data;
  } catch (error) {
    console.error("Error fetching short URLs:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const filteredUrls = computed(() => {
  if (!searchQuery.value) return shortUrls.value;

  const query = searchQuery.value.toLowerCase();
  return shortUrls.value.filter(
    (url) =>
      url.short_url.toLowerCase().includes(query) ||
      url.original_url.toLowerCase().includes(query),
  );
});

onMounted(fetchShortUrls);
</script>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}

/* Animación de carga personalizada */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Asegurar que el contenido no se desborde en pantallas muy pequeñas */
@media (max-width: 320px) {
  .p-4 {
    padding: 0.75rem;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }
}
</style>