<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 border border-pink-800 animate-slide-up">
    <div class="flex items-center gap-2 mb-4 text-lg font-semibold">
      <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      Probar Redirección
    </div>
    <div class="mb-4">
      <label for="redirect-url" class="block mb-2 font-medium">Código de URL Corta</label>
      <input type="text" id="redirect-url" v-model="shortCode" placeholder="abc123" class="w-full px-4 py-3 bg-pink-950 border border-pink-800 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-100 transition-all duration-300">
    </div>
    <button @click="redirectToUrl" class="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 text-white font-medium py-3 px-4 rounded-md transition-all duration-300 uppercase animate-fade-in">Ir a URL Original</button>
    <div v-if="error" class="text-red-400 mt-2 text-sm animate-pulse-slow">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUrlInfoRequest } from '../api/http'
import type { UrlInfoResponse } from '../api/types'

const shortCode = ref<string>('')
const error = ref<string>('')

async function redirectToUrl() {
  error.value = ''
  if (!shortCode.value) {
    error.value = 'Por favor ingresa el código de la URL corta.'
    return
  }
  try {
    const data: UrlInfoResponse = await getUrlInfoRequest(shortCode.value)
    if (data && data.original_url) {
      // Open in new tab
      window.open(data.original_url, '_blank')
    } else {
      error.value = 'No se encontró la URL original.'
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al redirigir.'
  }
}
</script>