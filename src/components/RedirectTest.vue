<template>

      <div class="flex items-center gap-3 mb-6">
        <svg class="w-7 h-7 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 class=" text-2xl text-white font-bold">Configuración de API</h2>
      </div>

      <div class="space-y-6 min-w-xl">
        <div>
          <label for="redirect-url" class="block text-sm font-medium text-cyan-100 mb-2">Código de URL Corta</label>
          <input 
            type="text" 
            id="redirect-url" 
            v-model="shortCode" 
            placeholder="Ej: abc123xyz"
            class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-cyan-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
          >
        </div>
        <button 
          @click="redirectToUrl"
          class="w-full flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105  disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!shortCode.trim()"
        >
          Ir a URL Original
        </button>
        <p v-if="error" class="text-cyan-300 text-sm">{{ error }}</p>
      </div>
   

</template>



<script setup lang="ts">
import { ref } from 'vue'
// Asumimos que getUrlInfoRequest ahora podría devolver la URL completa o solo la original.
// Si la API devuelve la URL completa para redirección, no necesitamos construirla aquí.

const shortCode = ref<string>('')
const error = ref<string>('')

async function redirectToUrl() {
  error.value = ''
  if (!shortCode.value.trim()) {
    error.value = 'Por favor ingresa el código de la URL corta.'
    return
  }

  // Construir la URL de redirección. Asumimos que la API base está configurada y es accesible.
  // Y que el shortCode es solo el path.
  let baseUrl = localStorage.getItem('apiUrl') || window.location.origin;
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const redirectUrl = `${baseUrl}/${shortCode.value.trim()}`;

  try {
    // No necesitamos llamar a getUrlInfoRequest si la URL corta ya es la URL de redirección completa.
    // Simplemente abrimos la URL construida.
    // Si la API requiere una verificación antes de redirigir, entonces sí se necesitaría una llamada.
    // Por simplicidad, asumimos que el short code se anexa a la base URL de la API para la redirección.
    window.open(redirectUrl, '_blank')
  } catch (e: any) {
    console.error('Error al intentar abrir la URL:', e)
    error.value = 'Error al intentar abrir la URL. Verifica la consola para más detalles.'
  }
}
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios, aunque Tailwind debería cubrir la mayoría */
</style>