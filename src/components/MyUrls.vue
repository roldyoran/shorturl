<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-zinc-500/10 to-teal-500/10 pointer-events-none"></div>
    <div class="relative z-10">
      <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-3">
          <svg class="w-7 h-7 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300">Mis URLs Guardadas</h2>
        </div>
        <button 
          v-if="urls.length > 0"
          @click="confirmClearUrls"
          class="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
        >
          Borrar Historial
        </button>
      </div>

      <div v-if="urls.length === 0" class="text-center py-10 text-blue-200/80">
        <svg class="w-16 h-16 mx-auto mb-4 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="text-lg text-blue-100">No tienes URLs guardadas.</p>
        <p class="text-sm text-blue-200/70">Acorta una URL para que aparezca aquí.</p>
      </div>

      <div v-else class="overflow-x-auto bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
        <table class="w-full min-w-max text-sm text-left text-blue-100">
          <thead class="text-xs text-blue-200 uppercase bg-white/10">
            <tr>
              <th scope="col" class="px-6 py-3">URL Corta</th>
              <th scope="col" class="px-6 py-3">URL Original</th>
              <th scope="col" class="px-6 py-3">Fecha</th>
              <th scope="col" class="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(url, idx) in paginatedUrls" 
              :key="idx" 
              class="border-b border-white/10 hover:bg-white/10 transition-colors duration-150"
            >
              <td class="px-6 py-4 font-mono">
                <a :href="getFullShortUrl(url.short)" target="_blank" class="text-blue-300 hover:text-blue-200 hover:underline break-all">
                 https://shorturl.roldyoran.workers.dev/{{ url.short }}
                </a>
              </td>
              <td class="px-6 py-4 break-all">{{ url.original }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(url.date) }}</td>
              <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                <button 
                  @click="copyToClipboard(url.short)" 
                  class="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded-md transition-colors duration-200 transform hover:scale-[1.03]"
                >
                  Copiar
                </button>
                <button 
                  @click="removeUrl(url.original, url.short)" 
                  class="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-md transition-colors duration-200 transform hover:scale-[1.03]"
                >
                  Eliminar
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
        <span class="text-blue-200/80">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
        >
          Siguiente
        </button>
      </div>

      <!-- Componente de notificación reutilizable -->
      <Notification ref="notification" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue'
import Notification from './Notification.vue'

type UrlItem = { original: string; short: string; date: string }

const urls = ref<UrlItem[]>([])
const notification = ref<InstanceType<typeof Notification>>()
const itemsPerPage = 10;
const currentPage = ref(1);
const copyUrl = inject('copyUrl') as (url: string) => void

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
  notification.value?.showNotification('URL eliminada correctamente')
}

function copyToClipboard(text: string) {
  if (copyUrl) {
    copyUrl(getFullShortUrl(text))
  }
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