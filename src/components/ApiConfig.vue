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
          <div class="relative p-4 bg-white/5 rounded-lg border border-white/10 shadow-inner">
            <p class="text-blue-200/90 text-sm leading-relaxed">
              El acortador de urls utiliza una clave de API para autenticarse. 
              <span class="text-yellow-400/90 font-medium">Puede probar el acortador un máximo de 3 veces.</span>
            </p>
            <div class="absolute -inset-[1px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg -z-10"></div>
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
        <!-- <p class="text-xs text-blue-200/80 italic">Estos datos se guardan localmente en tu navegador.</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'


const apiKey = ref<string>(import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey') || '')

const apiUrl = "https://shorturl.roldyoran.workers.dev/"

watch(apiKey, (val) => {
  try {
    localStorage.setItem('apiKey', val)
  } catch (e) {
    console.error('Error guardando apiKey en localStorage:', e)
  }
})


</script>

<style scoped>
/* Estilos específicos del componente si son necesarios, aunque Tailwind debería cubrir la mayoría */
</style>