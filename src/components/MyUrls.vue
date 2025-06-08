<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/10 overflow-hidden bg-zinc-950/60">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-zinc-900/10 to-teal-900/10 pointer-events-none"></div>
    <div class="relative z-10">
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
            <Database class="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-300">Mis URLs Guardadas</h2>
            <p class="text-sm text-zinc-400 mt-1">Gestiona tus enlaces acortados</p>
          </div>
        </div>
        <button 
          v-if="urls.length > 0"
          @click="confirmClearUrls"
          class="group px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500 hover:to-red-600 text-red-400 hover:text-white text-sm font-medium rounded-lg border border-red-500/30 hover:border-red-500 transition-all duration-300 flex items-center gap-2"
        >
          <Trash class="w-4 h-4" />
          <span>Borrar Historial</span>
        </button>
      </div>

      <!-- Estado vacío -->
      <div v-if="urls.length === 0" class="text-center py-16 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-xl border border-white/5">
        <div class="p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 inline-block mb-4">
          <Link class="w-8 h-8 text-cyan-400" />
        </div>
        <p class="text-xl font-semibold text-white mb-2">No tienes URLs guardadas</p>
        <p class="text-zinc-400">Comienza acortando una URL para verla aquí</p>
      </div>

      <!-- Tabla de URLs -->
      <div v-else class="space-y-6">
        <!-- Tabla -->
        <div class="bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/10">
  <table class="w-full">
    <thead class="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border-b border-white/10">
      <tr>
        <th scope="col" class="px-4 py-3 text-xs font-medium text-purple-300 uppercase tracking-wider">URL</th>
        <th scope="col" class="px-4 py-3 text-xs font-medium text-purple-300 uppercase tracking-wider">Fecha</th>
        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">Acciones</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
      <tr 
        v-for="(url, idx) in paginatedUrls" 
        :key="idx" 
        class="hover:bg-white/5 transition-colors duration-200"
      >
        <td class="px-4 py-3 font-mono max-w-[50vw]"> <!-- Añadido max-w -->
          <a 
            :href="getFullShortUrl(url.short)" 
            target="_blank" 
            class="text-cyan-400 hover:text-cyan-300 hover:underline break-all flex items-center gap-2 group"
          >
            <span class="truncate">https://shorturl.roldyoran.workers.dev/{{ url.short }}</span>
            <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
          <div class="flex items-center space-x-2 text-zinc-300 truncate">
            <Globe class="w-4 h-4 text-zinc-500 shrink-0" />
            <span class="truncate" :title="url.original">{{ url.original.length > 50 ? url.original.substring(0, 50) + '...' : url.original }}</span>
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex items-center space-x-2 text-zinc-400">
            <Clock class="w-4 h-4 shrink-0" />
            <span>{{ formatDate(url.date) }}</span>
          </div>
        </td>
        <td class="px-6 py-4">
                  <div class="flex items-center justify-end space-x-2">
                    <button 
                      @click="copyToClipboard('https://shorturl.roldyoran.workers.dev/' + url.short)"
                      class="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-200 tooltip"
                      data-tooltip="Copiar URL completa"
                    >
                      <Copy class="w-4 h-4" />
                    </button>
                    <button 
                      @click="copyToClipboard(url.short)"
                      class="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200 tooltip"
                      data-tooltip="Copiar código"
                    >
                      <Hash class="w-4 h-4" />
                    </button>
                    <button 
                      @click="removeUrl(url.original, url.short)" 
                      class="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 tooltip"
                      data-tooltip="Eliminar URL"
                    >
                      <Trash class="w-4 h-4" />
                    </button>
                  </div>
                </td>
      </tr>
    </tbody>
  </table>
</div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 text-sm">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:cursor-not-allowed transition-all duration-200 border border-white/10"
          >
            <ChevronLeft class="w-4 h-4" />
            <span>Anterior</span>
          </button>
          <div class="px-4 py-2 rounded-lg bg-zinc-900/50 border border-white/10 text-zinc-300">
            Página {{ currentPage }} de {{ totalPages }}
          </div>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:cursor-not-allowed transition-all duration-200 border border-white/10"
          >
            <span>Siguiente</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { copyToClipboard } from '../utils/copyUrl';
import { deleteUrl } from '../utils/deleteUrl';
import { 
  Copy, 
  Trash, 
  Database, 
  Link,
  ExternalLink,
  Globe,
  Clock,
  Hash,
  ChevronLeft,
  ChevronRight 
} from 'lucide-vue-next'

type UrlItem = { original: string; short: string; date: string }

const urls = ref<UrlItem[]>([])
const itemsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil(urls.value.length / itemsPerPage);
});

const paginatedUrls = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return urls.value.slice(start, end);
});

function getFullShortUrl(shortCode: string): string {
  let baseUrl = localStorage.getItem('apiUrl') || window.location.origin;
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  return `${baseUrl}/${shortCode}`;
}

function loadUrls() {
  try {
    const storedUrls = localStorage.getItem('savedUrls')
    if (storedUrls) {
      const parsedUrls: UrlItem[] = JSON.parse(storedUrls)
      const uniqueUrls = removeDuplicateUrls(parsedUrls)
      urls.value = uniqueUrls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      urls.value = []
    }
  } catch (e) {
    console.error('Error cargando URLs de localStorage:', e)
    urls.value = []
  }
}

function removeDuplicateUrls(urlList: UrlItem[]): UrlItem[] {
  const seen = new Set<string>()
  return urlList.filter(url => {
    if (seen.has(url.original)) return false
    seen.add(url.original)
    return true
  })
}

function confirmClearUrls() {
  if (window.confirm('¿Estás seguro de que quieres borrar todo el historial de URLs? Esta acción no se puede deshacer.')) {
    clearUrls()
    window.$toast('Historial borrado correctamente', { class: 'bg-red-500' })
  }
}

function clearUrls() {
  localStorage.removeItem('savedUrls')
  urls.value = []
  currentPage.value = 1;
}

function removeUrl(original: string, short: string) {
  urls.value = urls.value.filter(u => !(u.original === original && u.short === short))
  localStorage.setItem('savedUrls', JSON.stringify(urls.value))
  if (paginatedUrls.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
  deleteUrl()
  window.$toast('URL eliminada correctamente', { class: 'bg-red-500' })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Fecha desconocida';
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return 'Fecha inválida';
  }
}

onMounted(loadUrls)
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
}

.tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}
</style>

