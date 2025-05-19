<template>
  <div class="min-h-screen text-gray-100 flex flex-col relative">
    <canvas ref="particlesCanvas" class="fixed inset-0 w-full h-full -z-20 pointer-events-none" style="background:transparent;"></canvas>
    <header class="bg-gradient-to-r from-yellow-900/60 via-yellow-800/60 to-yellow-900/60 shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="ml-3 font-bold text-xl text-yellow-200 drop-shadow">ShortURL Pro</span>
          </div>
          <nav class="hidden md:flex space-x-4">
            <button
              @click="activeTab = 'shorten'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'shorten' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']"
            >
              Acortar URL
            </button>
            <button
              @click="activeTab = 'info'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'info' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']"
            >
              Información de URL
            </button>
            <button
              @click="activeTab = 'myurls'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'myurls' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']"
            >
              Mis URLs
            </button>
          </nav>
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-yellow-200 hover:text-yellow-400 focus:outline-none">
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
          <button @click="activeTab = 'shorten'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'shorten' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']">Acortar URL</button>
          <button @click="activeTab = 'info'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'info' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']">Información de URL</button>
          <button @click="activeTab = 'myurls'; mobileMenuOpen = false" :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'myurls' ? 'bg-yellow-500 text-yellow-900 shadow' : 'text-yellow-200 hover:bg-yellow-700/60 hover:text-yellow-100']">Mis URLs</button>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section class="text-center mb-12 bg-gradient-to-br from-yellow-400/20 via-yellow-700/10 to-yellow-900/30 rounded-2xl shadow-xl p-8 border border-yellow-700/30">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 mb-4 drop-shadow-lg">
          ShortURL Pro: Acortador de Enlaces Profesional
        </h1>
        <p class="text-lg text-yellow-100 max-w-4xl mx-auto mb-4">
          Este proyecto es un acortador de URLs moderno y eficiente, ideal para compartir enlaces de manera rápida y profesional. Potenciado por Cloudflare Workers para máxima velocidad y confiabilidad.
        </p>
        <div class="flex flex-col items-center gap-2 mb-4">
          <span class="text-yellow-300 font-semibold">URL principal del servicio:</span>
          <a href="https://shorturl.roldyoran.workers.dev/" target="_blank" class="text-lg font-mono text-yellow-200 hover:text-yellow-400 underline transition-all">https://shorturl.roldyoran.workers.dev/</a>
        </div>
        <div class="mt-6">
          <h2 class="text-2xl font-bold text-yellow-300 mb-2">URLs cortas disponibles</h2>
          <div class="overflow-x-auto rounded-lg shadow border border-yellow-700/30 bg-gray-900/80">
            <table class="w-full min-w-max text-sm text-left text-yellow-100">
              <thead class="text-xs text-yellow-300 uppercase bg-yellow-900/60">
                <tr>
                  <th scope="col" class="px-6 py-3">Código</th>
                  <th scope="col" class="px-6 py-3">Enlace Original</th>
                  <th scope="col" class="px-6 py-3">URL Corta</th>
                  <th scope="col" class="px-6 py-3">Copiar</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-yellow-900/30 transition-colors" v-for="url in shortUrls" :key="url.code">
                  <td class="px-6 py-4 font-mono">
                    <a :href="baseUrl + url.code" target="_blank" class="text-yellow-300 hover:text-yellow-400 underline">{{ url.code }}</a>
                  </td>
                  <td class="px-6 py-4 break-all">
                    <a :href="url.original" target="_blank" class="hover:underline text-yellow-100 hover:text-yellow-300">{{ url.original }}</a>
                  </td>
                  <td class="px-6 py-4 break-all font-mono text-yellow-200">
                    <span>{{ baseUrl + url.code }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <button @click="copyUrl(baseUrl + url.code)" class="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300">
                      Copiar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
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

    <footer class="bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700 text-yellow-200 text-center py-6 mt-auto border-t border-yellow-700/40 shadow-inner">
      <p>&copy; {{ new Date().getFullYear() }} ShortURL Pro. Todos los derechos reservados.</p>
      <p class="text-sm">Desarrollado con Vue.js, Tailwind CSS y Cloudflare Workers.</p>
    </footer>
    <transition name="fade-modal">
      <div v-if="showCopyModal" class="fixed bottom-6 right-6 z-50 bg-yellow-900/90 border border-yellow-500 rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 animate-fade-in-up">
        <svg class="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-yellow-200 font-semibold">¡URL copiada al portapapeles!</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import CopyNotification from './components/CopyNotification.vue'
import ApiConfig from './components/ApiConfig.vue'
import RedirectTest from './components/RedirectTest.vue'
import ShortenUrl from './components/ShortenUrl.vue'
import UrlInfo from './components/UrlInfo.vue'
import MyUrls from './components/MyUrls.vue'

type Tab = 'shorten' | 'info' | 'myurls'

const activeTab = ref<Tab>('shorten')
const mobileMenuOpen = ref(false)
const baseUrl = 'https://shorturl.roldyoran.workers.dev/';
const shortUrls = [
  { code: 'roldyoran', original: 'https://github.com/roldyoran' },
  { code: 'google', original: 'https://www.google.com' },
  { code: 'wikipedia', original: 'https://www.wikipedia.org' },
  { code: 'github', original: 'https://github.com' },
  { code: 'youtube', original: 'https://www.youtube.com' },
  { code: 'twitter', original: 'https://twitter.com' },
  { code: 'twitch', original: 'https://www.twitch.tv' },
  { code: 'facebook', original: 'https://www.facebook.com' },
  { code: 'linkedin', original: 'https://www.linkedin.com' },
  { code: 'instagram', original: 'https://www.instagram.com' },
  { code: 'tiktok', original: 'https://www.tiktok.com' },
  { code: 'reddit', original: 'https://www.reddit.com' },
  { code: 'pinterest', original: 'https://www.pinterest.com' },
  { code: 'whatsapp', original: 'https://web.whatsapp.com' },
  { code: 'telegram', original: 'https://web.telegram.org' },
  { code: 'discord', original: 'https://discord.com' },
  { code: 'netflix', original: 'https://www.netflix.com' },
  { code: 'amazon', original: 'https://www.amazon.com' },
  { code: 'spotify', original: 'https://open.spotify.com' },
  { code: 'apple', original: 'https://www.apple.com' },
  { code: 'samsung', original: 'https://www.samsung.com' },
  { code: 'microsoft', original: 'https://www.microsoft.com' }
];

const showCopyModal = ref(false)
let copyModalTimeout: ReturnType<typeof setTimeout> | null = null

function showCopyNotification() {
  showCopyModal.value = true
}
function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
    .then(() => {
      showCopyNotification()
    })
    .catch(() => {
      // Opcional: manejar error
    });
}
provide('copyUrl', copyUrl)
provide('showCopyNotification', showCopyNotification)
if (copyModalTimeout) clearTimeout(copyModalTimeout)
      copyModalTimeout = setTimeout(() => {
        showCopyModal.value = false
      }, 2000)
if (copyModalTimeout) {
  clearTimeout(copyModalTimeout);
  copyModalTimeout = setTimeout(() => {
    showCopyModal.value = false;
  }, 2000);
}


const particlesCanvas = ref<HTMLCanvasElement|null>(null)
let animationId: number | null = null
let particles: any[] = []
function randomColor() {
  // Dorado suave
  return 'rgba(253, 224, 71, 0.7)';
}
function createParticles(count:number, width:number, height:number) {
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      dx: -0.5 + Math.random(),
      dy: -0.5 + Math.random(),
      color: randomColor()
    })
  }
  return arr
}
function animateParticles(ctx:CanvasRenderingContext2D, width:number, height:number) {
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI)
    ctx.fillStyle = p.color
    ctx.shadowColor = '#fde047'
    ctx.shadowBlur = 8
    ctx.fill()
    p.x += p.dx
    p.y += p.dy
    if (p.x < 0 || p.x > width) p.dx *= -1
    if (p.y < 0 || p.y > height) p.dy *= -1
  }
  animationId = requestAnimationFrame(() => animateParticles(ctx, width, height))
}
onMounted(() => {
  const canvas = particlesCanvas.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  function resize() {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    particles = createParticles(60, canvas.width, canvas.height)
  }
  resize()
  window.addEventListener('resize', resize)
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
    animateParticles(ctx, canvas.width, canvas.height)
  }
  onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
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

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-modal-enter-to,
.fade-modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<CopyNotification :show="showCopyModal" @update:show="val => showCopyModal = val" />
