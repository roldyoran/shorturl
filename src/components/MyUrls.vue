<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 border border-pink-800 hover:shadow-2xl transition-all duration-300 animate-slide-up">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2 text-lg font-semibold">
        <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Mis URLs Guardadas
      </div>
      <button @click="clearUrls" class="text-orange-400 hover:text-orange-300 text-sm px-3 py-1 rounded-md border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 animate-fade-in">
        Borrar Historial
      </button>
    </div>
    <div v-if="urls.length === 0" class="text-center py-8 text-pink-200 animate-fade-in">
      No tienes URLs guardadas. Acorta una URL para comenzar a guardarla automáticamente.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-pink-800 text-left text-pink-200">
            <th class="pb-2 font-medium">URL Corta</th>
            <th class="pb-2 font-medium">URL Original</th>
            <th class="pb-2 font-medium">Fecha</th>
            <th class="pb-2 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(url, idx) in urls" :key="idx" class="border-b border-pink-800 hover:bg-pink-950/30 animate-fade-in">
            <td class="py-2 break-all">
              <a :href="baseURL + '/' + url.short" target="_blank" class="text-orange-400 hover:underline">{{ url.short }}</a>
            </td>
            <td class="py-2 break-all">{{ url.original }}</td>
            <td class="py-2">{{ formatDate(url.date) }}</td>
            <td class="py-2 text-right">
              <button @click="copyToClipboard(url.short)" class="text-pink-400 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-fuchsia-600/20 px-3 py-1 rounded-md transition-all duration-300 text-sm transform hover:scale-105 animate-slide-up">Copiar</button>
              <button @click="removeUrl(idx)" class="ml-2 text-orange-400 hover:text-orange-300 text-sm px-2 py-1 rounded-md border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 animate-fade-in">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="copySuccess" class="text-orange-400 text-sm mt-2 animate-fade-in">¡URL copiada al portapapeles!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type UrlItem = { original: string; short: string; date: string }

const urls = ref<UrlItem[]>([])
const copySuccess = ref<boolean>(false)
// let baseURL = localStorage.getItem('apiUrl') || ''
const baseURL = ref('')

function loadUrls() {
  urls.value = JSON.parse(localStorage.getItem('savedUrls') || '[]')
  baseURL.value = localStorage.getItem('apiUrl') || ''
  if (baseURL.value.endsWith('/')) baseURL.value = baseURL.value.slice(0, -1)
}

function clearUrls() {
  localStorage.removeItem('savedUrls')
  urls.value = []
}

function removeUrl(idx: number) {
  urls.value.splice(idx, 1)
  localStorage.setItem('savedUrls', JSON.stringify(urls.value))
}

function copyToClipboard(text: string) {
  const urlFinal = baseURL.value + "/" + text 
  navigator.clipboard.writeText(urlFinal).then(() => {
    copySuccess.value = true
    setTimeout(() => (copySuccess.value = false), 1500)
  })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(loadUrls)
</script>

<style scoped>
.bg-dark-card {
  background-color: #111111;
}
.text-dark-text-secondary {
  color: #94A3B8;
}
.bg-dark-input {
  background-color: #1A1A1A;
}
.border-dark-border {
  border-color: #2A2A2A;
}
</style>