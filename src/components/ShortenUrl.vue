<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 border border-pink-800 hover:shadow-2xl transition-all duration-300 animate-slide-up">
    <div class="flex items-center gap-2 mb-6 text-lg font-semibold">
      <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      Acortar URL
    </div>
    <form @submit.prevent="shortenUrl" class="mb-6">
      <div class="mb-4">
        <label for="original-url" class="block mb-2 font-medium">URL Original</label>
        <div class="flex">
          <input type="url" id="original-url" v-model="originalUrl" placeholder="https://ejemplo.com/pagina-muy-larga" required class="flex-grow px-4 py-3 bg-pink-950 border border-pink-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-100 transition-all duration-300">
          <button type="submit" class="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 text-white font-medium py-3 px-6 rounded-r-md transition duration-300 uppercase flex items-center animate-fade-in">
            Acortar
            <span v-if="loading" class="ml-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </button>
        </div>
        <div v-if="error" class="text-red-400 mt-2 text-sm animate-pulse-slow">{{ error }}</div>
      </div>
    </form>
    <div v-if="shortUrl" class="bg-gradient-to-br from-pink-900 to-fuchsia-900 rounded-md p-4 border border-pink-800 animate-fade-in shadow-inner">
      <div class="font-semibold mb-2">URL Acortada:</div>
      <div class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-fuchsia-600/10 rounded-md mb-2 backdrop-blur-sm transition-all duration-300 hover:from-orange-500/20 hover:to-fuchsia-600/20">
        <span class="break-all mr-2">{{ shortUrl }}</span>
        <button @click="copyToClipboard" class="text-pink-400 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-fuchsia-600/20 px-3 py-1 rounded-md transition-all duration-300 text-sm transform hover:scale-105">Copiar</button>
      </div>
      <div v-if="copySuccess" class="text-orange-400 text-sm mt-2 animate-fade-in">¡URL copiada al portapapeles!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const originalUrl = ref<string>('')
const shortUrl = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)
const copySuccess = ref<boolean>(false)

function getApiUrl() {
  return localStorage.getItem('apiUrl') || ''
}
function getApiKey() {
  return localStorage.getItem('apiKey') || ''
}

async function shortenUrl() {
  error.value = ''
  shortUrl.value = ''
  copySuccess.value = false
  if (!originalUrl.value) {
    error.value = 'Por favor ingresa una URL.'
    return
  }
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()
  if (!apiUrl) {
    error.value = 'Configura la URL base de la API primero.'
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${apiUrl}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey ? `Bearer ${apiKey}` : ''
      },
      body: JSON.stringify({ url: originalUrl.value })
    })
    if (!res.ok) throw new Error('No se pudo acortar la URL.')
    const data = await res.json()
    if (data && data.shortUrl) {
      shortUrl.value = data.shortUrl
      saveUrl(originalUrl.value, data.shortUrl)
    } else {
      error.value = 'Respuesta inválida de la API.'
    }
  } catch (e) {
    error.value = 'Error al acortar la URL.'
  } finally {
    loading.value = false
  }
}

function copyToClipboard() {
  if (!shortUrl.value) return
  navigator.clipboard.writeText(shortUrl.value).then(() => {
    copySuccess.value = true
    setTimeout(() => (copySuccess.value = false), 1500)
  })
}

function saveUrl(original: string, short: string) {
  const urls = JSON.parse(localStorage.getItem('savedUrls') || '[]')
  urls.unshift({ original, short, date: new Date().toISOString() })
  localStorage.setItem('savedUrls', JSON.stringify(urls.slice(0, 50)))
}
</script>

<style scoped>
.bg-dark-card {
  background-color: #111111;
}
.text-dark-text {
  color: #F8FAFC;
}
.bg-dark-input {
  background-color: #1A1A1A;
}
.border-dark-border {
  border-color: #2A2A2A;
}
</style>