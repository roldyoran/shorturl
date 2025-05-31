<template>
  <div class="relative backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden bg-zinc-950/60">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-zinc-500/10 to-teal-500/10 pointer-events-none"></div>
    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-7 h-7 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-300">Información de URL</h2>
      </div>
      
      <form @submit.prevent="getUrlInfo" class="space-y-6">
        <div>
          <label for="short-url-code" class="block text-sm font-medium text-cyan-100 mb-2">Código de URL Corta</label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              id="short-url-code" 
              v-model="shortCode" 
              placeholder="Ej: abc123" 
              required 
              class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-cyan-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
            >
            <button 
              type="submit" 
              class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Obtener
              <span v-if="loading" class="ml-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </span>
            </button>
          </div>
          <div v-if="error" class="text-red-400 mt-2 text-sm animate-pulse">{{ error }}</div>
        </div>
      </form>
      
      <div v-if="urlInfo" class="mt-8 bg-zinc-800/60 backdrop-blur-sm rounded-lg p-4 shadow-inner border border-white/10">
        <p class="text-sm font-medium text-cyan-100 mb-2">Información de la URL:</p>
        <div class="flex items-center justify-between bg-zinc-950/50 p-3 rounded-md mb-4 border border-white/10">
          <span class="break-all mr-4 text-cyan-300 font-mono text-sm">{{ urlInfo.original_url }}</span>
          <button 
            @click="copyToClipboard(urlInfo.original_url)" 
            class="px-4 py-2 text-white/80  text-xs font-semibold rounded-md duration-200 transform hover:scale-120 transition-all whitespace-nowrap"
          >
          <Copy class="inline-block mr-1 w-4 h-4" />
            Copiar
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-zinc-950/50 rounded-lg p-4 text-center border border-white/10">
            <div class="text-3xl font-bold mb-1 text-teal-300">{{ urlInfo.clicks }}</div>
            <div class="text-cyan-200 text-sm">Clicks</div>
          </div>
          <div class="bg-zinc-950/50 rounded-lg p-4 text-center border border-white/10">
            <div class="text-3xl font-bold mb-1 text-cyan-300">{{ urlInfo.created_at }}</div>
            <div class="text-cyan-200 text-sm">Creada</div>
          </div>
        </div>
      </div>

      <!-- Componente de notificación reutilizable -->
      <Notification ref="notification" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUrlInfoRequest } from '../api/http'
import { copyToClipboard } from '../utils/copyUrl'
import type { UrlInfoResponse } from '../api/types'
import { Copy } from 'lucide-vue-next'

const shortCode = ref<string>('')
const urlInfo = ref<UrlInfoResponse | null>(null)
const error = ref<string>('')
const loading = ref<boolean>(false)
const notification = ref<InstanceType<typeof Notification>>()


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
    // Format the date to be more readable
    const formattedDate = new Date(data.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    urlInfo.value = {
      clicks: data.clicks,
      created_at: formattedDate,
      original_url: data.original_url,
      short_url: data.short_url
    }
    // notification.value?.showNotification('Información de URL obtenida correctamente')
    // copyUrl("Información de URL obtenida correctamente")
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Error al obtener la información.'
    // notification.value?.showNotification(error.value, 3000)
  } finally {
    loading.value = false
  }
}


</script>