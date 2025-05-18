<template>
  <div class="bg-gradient-to-br from-fuchsia-900 via-pink-900 to-orange-900 rounded-lg shadow-lg p-6 mb-6 border border-pink-800 animate-slide-up">
    <div class="flex items-center gap-2 mb-4 text-lg font-semibold">
      <svg class="w-5 h-5 text-pink-400 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
      Configuración de API
    </div>
    <div class="mb-4">
      <label for="api-key" class="block mb-2 font-medium">Clave de API</label>
      <input type="text" id="api-key" v-model="apiKey" placeholder="Ingresa tu clave de API" class="w-full px-4 py-3 bg-pink-950 border border-pink-800 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-100 transition-all duration-300">
    </div>
    <div class="mb-4">
      <label for="api-url" class="block mb-2 font-medium">URL Base de la API</label>
      <input type="url" id="api-url" v-model="apiUrl" placeholder="https://tu-worker.workers.dev" class="w-full px-4 py-3 bg-pink-950 border border-pink-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-pink-100 transition-all duration-300">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const apiKey = ref<string>(localStorage.getItem('apiKey') || '')
const apiUrl = ref<string>(localStorage.getItem('apiUrl') || '')

watch(apiKey, (val) => {
  localStorage.setItem('apiKey', val)
})
watch(apiUrl, (val) => {
  localStorage.setItem('apiUrl', val)
})
</script>