<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden bg-zinc-950/60">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-zinc-900/10 to-teal-900/10 pointer-events-none"></div>
    <div class="relative z-10">
      <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-3">
          <Database class="inline-block w-7 h-7 text-cyan-400" />
          <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-300">Mis URLs Guardadas</h2>
        </div>
        <button 
          v-if="urls.length > 0"
          @click="confirmClearUrls"
          class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-black text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
        >
          Borrar Historial
        </button>
      </div>

      <div v-if="urls.length === 0" class="text-center  text-cyan-200/80">
        <svg class="w-10 h-10 mx-auto mb-4 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="text-lg text-cyan-100">No tienes URLs guardadas.</p>
        <p class="text-sm text-cyan-200/70">Acorta una URL para que aparezca aquí.</p>
      </div>

      <div v-else class="overflow-x-auto bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
        <table class="w-full min-w-max text-sm text-left text-white/80 ">
          <thead class="text-xs text-purple-300 uppercase bg-zinc-700/20">
            <tr>
              <th scope="col" class="px-6 py-3">URL Corta</th>
              <th scope="col" class="px-6 py-3">URL Original</th>
              <th scope="col" class="px-6 py-3">Fecha</th>
              <th scope="col" class="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(url, idx) in paginatedUrls" 
              :key="idx" 
              class="border-b border-white/10 hover:bg-white/5 transition-colors duration-150"
            >
              <td class="px-6 py-4 font-mono">
                <a :href="getFullShortUrl(url.short)" target="_blank" class="text-cyan-400 hover:text-cyan-300 hover:underline break-all">
                 https://shorturl.roldyoran.workers.dev/{{ url.short }}
                </a>
              </td>
              <td class="px-6 py-4 break-all">{{ url.original }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(url.date) }}</td>
              <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                <button 
                    @click="copyToClipboard('https://shorturl.roldyoran.workers.dev/' + url.short)"
                  class="px-3 py-1.5 hover:scale-150 text-zinc-200 hover:text-white transition-all"
                >
                  <Copy class="inline-block mr-1 w-4 h-4" />
                </button>
                <button 
                  @click="removeUrl(url.original, url.short)" 
                  class="px-3 py-1.5 text-red-500 hover:text-red-400 hover:scale-150 transition-all "
                >
                  <Trash class="inline-block mr-1 w-4 h-4" />
                  
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-2 text-sm">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
        >
          Anterior
        </button>
        <span class="text-cyan-200/80">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
        >
          Siguiente
        </button>
      </div>

      <!-- Componente de notificación reutilizable -->
      <!-- <Notification ref="notification" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { copyToClipboard } from '../utils/copyUrl';
import { deleteUrl } from '../utils/deleteUrl';
import { Copy, Trash, Database } from 'lucide-vue-next'

type UrlItem = { original: string; short: string; date: string }

const urls = ref<UrlItem[]>([])
// const notification = ref<InstanceType<typeof Notification>>()
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
      // Eliminar duplicados basados en la URL original
      const parsedUrls: UrlItem[] = JSON.parse(storedUrls)
      const uniqueUrls = removeDuplicateUrls(parsedUrls)
      urls.value = uniqueUrls
    } else {
      urls.value = []
    }
  } catch (e) {
    console.error('Error cargando URLs de localStorage:', e)
    urls.value = [] // Resetear en caso de error de parseo
  }
}

function removeDuplicateUrls(urlList: UrlItem[]): UrlItem[] {
  const seen = new Set<string>()
  return urlList.filter(url => {
    // Verificar si ya hemos visto esta URL original
    if (seen.has(url.original)) {
      return false
    }
    seen.add(url.original)
    return true
  })
}

function confirmClearUrls() {
  if (window.confirm('¿Estás seguro de que quieres borrar todo el historial de URLs? Esta acción no se puede deshacer.')) {
    clearUrls()
  }
}

function clearUrls() {
  localStorage.removeItem('savedUrls')
  urls.value = []
  currentPage.value = 1; // Resetear paginación
}

function removeUrl(original: string, short: string) {
  urls.value = urls.value.filter(u => !(u.original === original && u.short === short))
  localStorage.setItem('savedUrls', JSON.stringify(urls.value))
  if (paginatedUrls.value.length === 0 && currentPage.value > 1) {
    currentPage.value--; // Retroceder si la página actual queda vacía
  }
  deleteUrl()
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Fecha desconocida';
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return 'Fecha inválida';
  }
}

onMounted(loadUrls)

</script>

<style scoped>
/* Estilos específicos del componente si son necesarios, aunque Tailwind debería cubrir la mayoría */
.bg-gray-750 {
  background-color: #374151; /* Un poco más oscuro que gray-700 para el header de la tabla */
}
</style>