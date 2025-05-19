<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 mb-6 border border-pink-800 animate-slide-up">
    <div class="flex items-center gap-2 mb-4 text-lg font-semibold">
      <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
      Configuración de API
    </div>
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <label for="api-key" class="font-medium">Clave de API</label>
        <button 
          @click="showApiKey = !showApiKey"
          class="text-pink-400 hover:text-pink-300 focus:outline-none transition-colors duration-300"
        >
          <svg 
            class="w-5 h-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              v-if="showApiKey"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path 
              v-if="showApiKey"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            <path 
              v-if="!showApiKey"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        </button>
      </div>
      <input 
        :type="showApiKey ? 'text' : 'password'" 
        id="api-key" 
        v-model="apiKey" 
        placeholder="Ingresa tu clave de API" 
        class="w-full px-4 py-3 bg-pink-950 border border-pink-800 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-100 transition-all duration-300"
      >
    </div>
    <div class="mb-4">
      <label for="api-url" class="block mb-2 font-medium">URL Base de la API</label>
      <input type="url" id="api-url" v-model="apiUrl" placeholder="https://tu-worker.workers.dev" class="w-full px-4 py-3 bg-pink-950 border border-pink-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-pink-100 transition-all duration-300">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const showApiKey = ref<boolean>(false)

const apiKey = ref<string>(localStorage.getItem('apiKey') || '')
const apiUrl = ref<string>(localStorage.getItem('apiUrl') || '')

watch(apiKey, (val) => {
  localStorage.setItem('apiKey', val)
})
watch(apiUrl, (val) => {
  localStorage.setItem('apiUrl', val)
})
</script>