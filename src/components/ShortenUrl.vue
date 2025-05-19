<template>
  <div class="bg-gradient-to-br from-yellow-400/20 via-yellow-700/10 to-yellow-900/30 rounded-2xl shadow-xl p-8 border border-yellow-700/30">
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-7 h-7 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300">Acortar URL</h2>
    </div>

    <form @submit.prevent="shortenUrl" class="space-y-6">
      <div>
        <label for="original-url" class="block text-sm font-medium text-yellow-100 mb-1">URL Original</label>
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="url" 
            id="original-url" 
            v-model="originalUrl" 
            placeholder="https://ejemplo.com/pagina-muy-larga-para-acortar"
            required 
            class="w-full px-4 py-3 bg-yellow-900/40 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-yellow-100 placeholder-yellow-200 transition-all duration-200 shadow-sm"
          >
          <button 
            type="submit" 
            :disabled="loading"
            class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-yellow-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span v-if="!loading">Acortar</span>
            <svg v-if="loading" class="animate-spin h-5 w-5 text-yellow-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
        <p v-if="error" class="text-yellow-300 mt-2 text-sm animate-pulse-slow">{{ error }}</p>
      </div>
    </form>

    <div v-if="shortUrl" class="mt-8 bg-yellow-900/40 rounded-lg p-4 shadow-inner">
      <p class="text-sm font-medium text-yellow-100 mb-2">URL Acortada:</p>
      <div class="flex items-center justify-between bg-yellow-800 p-3 rounded-md">
        <span class="break-all mr-4 text-yellow-300 font-mono text-sm">{{ shortUrl }}</span>
        <button 
          @click="copyToClipboard" 
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-md transition-colors duration-200 transform hover:scale-105 whitespace-nowrap"
        >
          Copiar
        </button>
      </div>
      <p v-if="copySuccess" class="text-yellow-400 text-sm mt-2 animate-fade-in">¡URL copiada al portapapeles!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { shortenUrlRequest } from '../api/http'
import type { UrlInfoResponse } from '../api/types'
import { inject } from 'vue'

const originalUrl = ref<string>('')
const shortUrl = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)
const copySuccess = ref<boolean>(false)
const copyUrl = inject('copyUrl') as (url: string) => void

async function shortenUrl() {
  error.value = ''
  shortUrl.value = ''
  copySuccess.value = false
  if (!originalUrl.value) {
    error.value = 'Por favor ingresa una URL.'
    return
  }
  loading.value = true
  try {
    const data: UrlInfoResponse = await shortenUrlRequest(originalUrl.value)
    if (data && data.short_url) {
      // Asumimos que la API devuelve solo el código corto. El prefijo se añade al copiar.
      shortUrl.value = data.short_url 
      saveUrl(data.original_url, data.short_url)
    } else {
      error.value = 'Respuesta inválida de la API.'
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al acortar la URL.'
  } finally {
    loading.value = false
  }
}

function copyToClipboard() {
  if (copyUrl && shortUrl) copyUrl(shortUrl.value)
}

function saveUrl(original: string, short: string) {
  try {
    const urls = JSON.parse(localStorage.getItem('savedUrls') || '[]')
    urls.unshift({ original, short, date: new Date().toISOString() })
    // Limitar a 50 URLs guardadas para no exceder el localStorage
    localStorage.setItem('savedUrls', JSON.stringify(urls.slice(0, 50)))
  } catch (e) {
    console.error('Error al guardar URL en localStorage:', e)
    // Opcional: notificar al usuario si el guardado falla, aunque es una función secundaria.
  }
}
</script>

<style scoped>
/* Se eliminan los estilos scoped ya que Tailwind se encarga de todo */
</style>