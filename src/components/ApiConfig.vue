<template>
  <div class="relative backdrop-blur-md  rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-zinc-500/10 to-teal-500/10 pointer-events-none"></div>
    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-7 h-7 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300">Configuración de API</h2>
      </div>

      <div class="space-y-6">
        <div>
          <label for="api-key" class="block text-sm font-medium text-blue-100 mb-1">Clave de API</label>
          <div class="relative">
            <input 
              :type="showApiKey ? 'text' : 'password'" 
              id="api-key" 
              v-model="apiKey" 
              placeholder="Ingresa tu clave de API"
              class="w-full px-4 py-3 pr-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-blue-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
            >
            <button 
              @click="showApiKey = !showApiKey"
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
              aria-label="Mostrar/ocultar clave de API"
            >
              <svg v-if="!showApiKey" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
        </div>

        <div>
          <label for="api-url" class="block text-sm font-medium text-blue-100 mb-1">URL Base de la API</label>
          <input 
            type="url" 
            id="api-url" 
            v-model="apiUrl" 
            placeholder="https://tu-worker.workers.dev"
            class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-blue-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
          >
        </div>
        <p class="text-xs text-blue-200/80 italic">Estos datos se guardan localmente en tu navegador.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const showApiKey = ref<boolean>(false)

const apiKey = ref<string>(localStorage.getItem('apiKey') || '')
const apiUrl = ref<string>(localStorage.getItem('apiUrl') || '')

watch(apiKey, (val) => {
  try {
    localStorage.setItem('apiKey', val)
  } catch (e) {
    console.error('Error guardando apiKey en localStorage:', e)
  }
})

watch(apiUrl, (val) => {
  try {
    localStorage.setItem('apiUrl', val)
  } catch (e) {
    console.error('Error guardando apiUrl en localStorage:', e)
  }
})
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios, aunque Tailwind debería cubrir la mayoría */
</style>