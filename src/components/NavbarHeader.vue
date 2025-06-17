<template>
  <!-- Header -->
  <header class="relative z-10 border-b border-zinc-800/50 bg-zinc-900/60 backdrop-blur-sm">
    <div class="container mx-auto px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50 backdrop-blur-sm relative">
            <Link2 class="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
            <span class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          <div>
            <h1 class="text-lg sm:text-xl font-bold text-zinc-100">ShortURL</h1>
            <p class="text-xs text-zinc-400">by roldyoran</p>
          </div>
          <div class="ml-4 px-3 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50">
            <p class="text-sm text-cyan-400">URLs Acortadas: <span class="font-mono">{{ attempts }}</span></p>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <button
            @click="showConfig = true"
            class="flex items-center text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
          >
            <Settings class="h-4 w-4 mr-2" />
            Configuración
          </button>

          <button
            @click="showTest = true"
            class="flex items-center text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
          >
            <ExternalLink class="h-4 w-4 mr-2" />
            Probar Redirección
          </button>

          <a
            href="https://github.com/roldyoran/shorturl"
            class="flex items-center text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
            target="_blank"
          >
            <Github class="h-4 w-4 mr-2" />
            GitHub
        </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 p-2 rounded-md"
        >
          <X v-if="mobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-zinc-800/50 pt-4">
        <div class="flex flex-col space-y-2">
          <button
             @click="showConfig = true"
            class="flex items-center justify-start text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
          >
            <Settings class="h-4 w-4 mr-2" />
            Configuración
          </button>

          <button
            @click="showTest = true"
            class="flex items-center justify-start text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
          >
            <ExternalLink class="h-4 w-4 mr-2" />
            Probar Redirección
          </button>

          <a
           href="https://github.com/roldyoran/shorturl"
            class="flex items-center justify-start text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
            target="_blank"
          >
            <Github class="h-4 w-4 mr-2" />
            GitHub
        </a>
        </div>
      </div>
    </div>

    <!-- Dialogo para configuración -->
<Dialog v-model="showConfig" >
    <div class="w-full max-w-2xl rounded-xl bg-zinc-900/95 border border-zinc-700/50 p-6 shadow-2xl relative">
      <button
        @click="showConfig = false"
        class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-all"
      >
        <X class="h-5 w-5" />
      </button>
        <ApiConfig />
    </div>
</Dialog>


        <!-- Dialogo para configuración -->
<Dialog v-model="showTest" >
    <div class="w-full max-w-2xl rounded-xl bg-zinc-900/95 border border-zinc-700/50 p-6 shadow-2xl relative">
      <button
        @click="showTest = false"
        class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-all"
      >
        <X class="h-5 w-5" />
      </button>
        <RedirectTest />
    </div>
</Dialog>
  </header>
</template>



<script setup lang="ts">
import { ref } from "vue";
import {
	Link2,
	Settings,
	ExternalLink,
	Github,
	Menu,
	X,
} from "lucide-vue-next";
import ApiConfig from "./ApiConfig.vue";
import Dialog from "./Dialog.vue";
import RedirectTest from "./RedirectTest.vue";

defineProps<{
	attempts: number;
}>();

// State
const showConfig = ref(false);
const showTest = ref(false);
const mobileMenuOpen = ref(false);
</script>