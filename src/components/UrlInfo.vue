<template>
  <div class="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-7 h-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Información de URL</h2>
    </div>
    <form @submit.prevent="getUrlInfo" class="space-y-6">
      <div>
        <label for="short-url-code" class="block text-sm font-medium text-gray-300 mb-1">Código de URL Corta</label>
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" id="short-url-code" v-model="shortCode" placeholder="Ej: abc123" required class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400 transition-all duration-200 shadow-sm">
          <button type="submit" class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            Obtener
            <span v-if="loading" class="ml-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </span>
          </button>
        </div>
        <div v-if="error" class="text-red-400 mt-2 text-sm animate-pulse-slow">{{ error }}</div>
      </div>
    </form>
    <div v-if="urlInfo" class="mt-8 bg-gray-700 rounded-lg p-4 shadow-inner">
      <p class="text-sm font-medium text-gray-300 mb-2">Información de la URL:</p>
      <div class="flex items-center justify-between bg-gray-600 p-3 rounded-md mb-4">
        <span class="break-all mr-4 text-indigo-300 font-mono text-sm">{{ urlInfo.original_url }}</span>
        <button @click="copyToClipboard" class="text-indigo-400 hover:bg-gray-500 px-3 py-1 rounded-md transition-all duration-200 text-sm transform hover:scale-105">Copiar</button>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-600 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold mb-1 text-indigo-300">{{ urlInfo.clicks }}</div>
          <div class="text-gray-400 text-sm">Clicks</div>
        </div>
        <div class="bg-gray-600 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold mb-1 text-indigo-300">{{ urlInfo.created_at }}</div>
          <div class="text-gray-400 text-sm">Creada</div>
        </div>
      </div>
      <div v-if="copySuccess" class="text-indigo-400 text-sm mt-2 animate-fade-in">¡URL copiada al portapapeles!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getUrlInfoRequest } from '../api/http'
import type { UrlInfoResponse } from '../api/types'

const shortCode = ref<string>('')
const urlInfo = ref<UrlInfoResponse | null>(null)
const error = ref<string>('')
const loading = ref<boolean>(false)
const copySuccess = ref<boolean>(false)

// const createdDate = computed(() => {
//   if (urlInfo.value && urlInfo.value.created_at) {
//     const date = new Date(urlInfo.value.created_at)
//     return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
//   }
//   return ''
// })

async function copyToClipboard() {
  if (urlInfo.value && urlInfo.value.original_url) {
    try {
      await navigator.clipboard.writeText(urlInfo.value.original_url)
      copySuccess.value = true
      setTimeout(() => { copySuccess.value = false }, 2000)
    } catch (e) {
      copySuccess.value = false
    }
  }
}

async function getUrlInfo() {
  error.value = ''
  urlInfo.value = null
  if (!shortCode.value) {
    error.value = 'Por favor ingresa el código de la URL corta.'
    return
  }
  loading.value = true
  try {
    const data = await getUrlInfoRequest(shortCode.value)
    urlInfo.value = {
      clicks: data.clicks,
      created_at: data.created_at,
      original_url: data.original_url,
      short_url: data.short_url
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al obtener la información.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>