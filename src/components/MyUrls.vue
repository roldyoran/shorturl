<template>
  <div class="bg-gradient-to-br from-yellow-400/20 via-yellow-700/10 to-yellow-900/30 rounded-2xl shadow-xl p-8 border border-yellow-700/30">
    <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <div class="flex items-center gap-3">
        <svg class="w-7 h-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300">Mis URLs Guardadas</h2>
      </div>
      <button 
        v-if="urls.length > 0"
        @click="confirmClearUrls"
        class="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-yellow-50 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
      >
        Borrar Historial
      </button>
    </div>

    <div v-if="urls.length === 0" class="text-center py-10 text-yellow-200">
      <svg class="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <p class="text-lg">No tienes URLs guardadas.</p>
      <p class="text-sm">Acorta una URL para que aparezca aquí.</p>
    </div>

    <div v-else class="overflow-x-auto bg-yellow-900/40 rounded-lg shadow">
      <table class="w-full min-w-max text-sm text-left text-yellow-100">
        <thead class="text-xs text-yellow-200 uppercase bg-yellow-900/60">
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
            class="bg-yellow-900/40 border-b border-yellow-700 hover:bg-yellow-900/60 transition-colors duration-150"
          >
            <td class="px-6 py-4 font-mono">
              <a :href="getFullShortUrl(url.short)" target="_blank" class="text-yellow-300 hover:text-yellow-200 hover:underline break-all">
                {{ url.short }}
              </a>
            </td>
            <td class="px-6 py-4 break-all">{{ url.original }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(url.date) }}</td>
            <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
              import { inject } from 'vue'
              const copyUrl = inject('copyUrl') as (url: string) => void
              function copyToClipboard(url: string) {
                if (copyUrl) copyUrl(url)
              }
              <button @click="copyToClipboard(getFullShortUrl(url.short))" class="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-md transition-colors duration-200 transform hover:scale-105">Copiar</button>
              <button @click="removeUrl(url.original, url.short)" class="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-yellow-50 text-xs font-semibold rounded-md transition-colors duration-200 transform hover:scale-105">Eliminar</button>
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
        class="px-3 py-1.5 rounded-md bg-yellow-900/40 hover:bg-yellow-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1.5 rounded-md bg-yellow-900/40 hover:bg-yellow-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >Siguiente</button>
    </div>

    <div v-if="copySuccess" class="fixed bottom-5 right-5 bg-yellow-500 text-yellow-900 text-sm py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300">
      ¡URL copiada al portapapeles!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

type UrlItem = { original: string; short: string; date: string }

const urls = ref<UrlItem[]>([])
const copySuccess = ref<boolean>(false)
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
    urls.value = storedUrls ? JSON.parse(storedUrls) : []
  } catch (e) {
    console.error('Error cargando URLs de localStorage:', e)
    urls.value = [] // Resetear en caso de error de parseo
  }
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
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copySuccess.value = true
    setTimeout(() => (copySuccess.value = false), 2000)
  }).catch(err => {
    console.error('Error al copiar:', err)
    // Podrías mostrar un mensaje de error al usuario aquí
  })
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