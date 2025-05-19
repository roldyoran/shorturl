<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
    <header class="bg-gray-800 shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="ml-3 font-bold text-xl text-white">ShortURL Pro</span>
          </div>
          <nav class="hidden md:flex space-x-4">
            <button
              @click="activeTab = 'shorten'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'shorten' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
            >
              Acortar URL
            </button>
            <button
              @click="activeTab = 'info'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'info' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
            >
              Información de URL
            </button>
            <button
              @click="activeTab = 'myurls'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'myurls' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
            >
              Mis URLs
            </button>
          </nav>
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-300 hover:text-white focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button @click="activeTab = 'shorten'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'shorten' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">Acortar URL</button>
          <button @click="activeTab = 'info'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'info' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">Información de URL</button>
          <button @click="activeTab = 'myurls'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'myurls' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white']">Mis URLs</button>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 mb-4">
          Acorta tus Enlaces con Estilo
        </h1>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">
          Transforma URLs largas en enlaces cortos, manejables y listos para compartir. Potenciado por Cloudflare Workers para un rendimiento ultrarrápido.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-8">
          <ApiConfig />
          <RedirectTest />
        </div>
        <div class="lg:col-span-2">
          <transition name="fade" mode="out-in">
            <div :key="activeTab">
              <ShortenUrl v-if="activeTab === 'shorten'" />
              <UrlInfo v-else-if="activeTab === 'info'" />
              <MyUrls v-else-if="activeTab === 'myurls'" />
            </div>
          </transition>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-gray-400 text-center py-6 mt-auto">
      <p>&copy; {{ new Date().getFullYear() }} ShortURL Pro. Todos los derechos reservados.</p>
      <p class="text-sm">Desarrollado con Vue.js, Tailwind CSS y Cloudflare Workers.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiConfig from './components/ApiConfig.vue'
import RedirectTest from './components/RedirectTest.vue'
import ShortenUrl from './components/ShortenUrl.vue'
import UrlInfo from './components/UrlInfo.vue'
import MyUrls from './components/MyUrls.vue'

type Tab = 'shorten' | 'info' | 'myurls'

const activeTab = ref<Tab>('shorten')
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>