<template>
  <div class="bg-particles"></div>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Navbar -->
    <nav class="flex justify-between items-center mb-10 animate-fade-in">
      <div class="flex items-center space-x-2">
        <svg class="w-8 h-8 text-fuchsia-400 animate-pulse-slow " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span class="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent text-shadow-strong">ShortURL Pro</span>
      </div>
    </nav>
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-3 text-shadow-strong">Construye conexiones digitales más fuertes</h1>
      <p class="text-lg text-fuchsia-200 mb-6">Acorta, comparte y gestiona tus enlaces fácilmente con Cloudflare Workers.</p>
    </div>
    <ApiConfig />
    <div class="grid md:grid-cols-2 gap-8 mb-8">
      <ShortenUrl />
      <UrlInfo />
    </div>
    <RedirectTest class="mb-8" />
    <MyUrls />
  </div>
  <footer class="mt-16 py-6 text-center text-fuchsia-300 text-sm bg-gradient-to-t from-black/70 to-transparent rounded-t-lg card-shadow">
    <p class="animate-pulse-slow">Acortador de URLs con Cloudflare Workers &copy; 2023</p>
  </footer>
</template>

<script setup lang="ts">
import ApiConfig from './components/ApiConfig.vue'
import RedirectTest from './components/RedirectTest.vue'
import ShortenUrl from './components/ShortenUrl.vue'
import UrlInfo from './components/UrlInfo.vue'
import MyUrls from './components/MyUrls.vue'
</script>

<style>
.bg-particles {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(circle at 20% 30%, #a21caf 0%, transparent 70%),
              radial-gradient(circle at 80% 70%, #f472b6 0%, transparent 70%),
              radial-gradient(circle at 50% 50%, #312e81 0%, transparent 80%);
  opacity: 0.22;
  filter: blur(2px) brightness(0.8);
}
.card-shadow {
  box-shadow: 0 2px 24px 0 #000a, 0 1.5px 8px 0 #a21caf44;
}
.glow-border {
  box-shadow: 0 0 8px 2px #f472b6, 0 0 24px 4px #a21caf66;
}
.text-shadow-strong {
  text-shadow: 0 2px 8px #000a, 0 1px 2px #a21caf88;
}
</style>