<template>
  
    <div class="mb-4">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-7 h-7 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <h2 class=" text-2xl text-white font-bold">Configuración de API</h2>
      </div>

      <div class="space-y-8">
          <div class="flex p-4 rounded-lg border border-yellow-500/50 bg-yellow-600/10 shadow-inner">
            <Info class="w-6 h-6 text-yellow-200" />
            <div class="ml-4">  
              <p class="text-yellow-300/90 text-sm leading-relaxed">
                El acortador de urls utiliza una clave de API para autenticarse. 
              </p>
                <span class="text-yellow-300 font-bold">Puede probar el acortador un máximo de 3 veces.</span>
            </div>
        </div>

        <div>
          <label for="api-url" class="block text-sm font-medium text-cyan-100 mb-2">URL Base de la API</label>
          <input 
            type="url" 
            id="api-url" 
            v-model="apiUrl" 
            placeholder="https://tu-worker.workers.dev"
            class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-cyan-200/70 transition-all duration-200 shadow-lg hover:bg-white/10"
          >
        </div>
        <!-- <p class="text-xs text-cyan-200/80 italic">Estos datos se guardan localmente en tu navegador.</p> -->
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Info } from "lucide-vue-next";

const apiKey = ref<string>(
	import.meta.env.VITE_API_KEY || localStorage.getItem("apiKey") || "",
);

const apiUrl = "https://shorturl.roldyoran.workers.dev/";

watch(apiKey, (val) => {
	try {
		localStorage.setItem("apiKey", val);
	} catch (e) {
		console.error("Error guardando apiKey en localStorage:", e);
	}
});
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios, aunque Tailwind debería cubrir la mayoría */
</style>