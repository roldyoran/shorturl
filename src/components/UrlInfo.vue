<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 border border-pink-800 hover:shadow-2xl transition-all duration-300 animate-slide-up">
    <div class="flex items-center gap-2 mb-6 text-lg font-semibold">
      <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Información de URL
    </div>
    <form @submit.prevent="getUrlInfo" class="mb-6">
      <div class="mb-4">
        <label for="short-url-code" class="block mb-2 font-medium">Código de URL Corta</label>
        <div class="flex">
          <input type="text" id="short-url-code" v-model="shortCode" placeholder="abc123" required class="flex-grow px-4 py-3 bg-pink-950 border border-pink-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-100 transition-all duration-300">
          <button type="submit" class="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 text-white font-medium py-3 px-6 rounded-r-md transition duration-300 uppercase flex items-center animate-fade-in">
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
    <div v-if="urlInfo" class="bg-gradient-to-br from-pink-900 to-fuchsia-900 rounded-md p-4 border border-pink-800 animate-fade-in shadow-inner">
      <div class="font-semibold mb-2">Información de la URL:</div>
      <div class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-fuchsia-600/10 rounded-md mb-4 backdrop-blur-sm transition-all duration-300 hover:from-orange-500/20 hover:to-fuchsia-600/20">
        <span class="break-all mr-2">{{ urlInfo.original_url }}</span>
        <button @click="copyToClipboard" class="text-pink-400 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-fuchsia-600/20 px-3 py-1 rounded-md transition-all duration-300 text-sm transform hover:scale-105">Copiar</button>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-orange-900 bg-opacity-30 rounded-md p-4 text-center animate-slide-up">
          <div class="text-3xl font-bold mb-1">{{ urlInfo.clicks }}</div>
          <div class="text-pink-200 text-sm">Clics</div>
        </div>
        <div class="bg-fuchsia-900 bg-opacity-30 rounded-md p-4 text-center animate-slide-up">
          <div class="text-3xl font-bold mb-1">{{ urlInfo.created_at }}</div>
          <div class="text-pink-200 text-sm">Creada</div>
        </div>
      </div>
      <div v-if="copySuccess" class="text-orange-400 text-sm mt-2 animate-fade-in">¡URL copiada al portapapeles!</div>
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

const createdDate = computed(() => {
  if (urlInfo.value && urlInfo.value.created_at) {
    const date = new Date(urlInfo.value.created_at)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return ''
})

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