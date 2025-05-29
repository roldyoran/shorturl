<template>
  <div class="min-h-screen bg-gray-900/10 text-gray-100 flex flex-col relative">
    <canvas ref="particlesCanvas" class="fixed inset-0 w-full h-full -z-20 pointer-events-none" style="background:transparent;"></canvas>
    
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-900/60 via-blue-800/60 to-purple-900/60 shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="ml-3 font-bold text-xl text-blue-200 drop-shadow">
              ShortURL
              <span class="block text-sm opacity-75">by roldyoran</span>
            </span>
          </div>
          
          <nav class="hidden md:flex space-x-4">
            <a href="#main-content">
              <button
                @click="activeTab = 'shorten'"
                :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'shorten' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
              >
                Acortar URL
              </button>
            </a>
            <a href="#main-content">
            <button
              @click="activeTab = 'info'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'info' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
            >
              Información de URL
            </button>
            </a>
            <a href="#main-content">
            <button
              @click="activeTab = 'myurls'"
              :class="['px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150', activeTab === 'myurls' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
            >
              Mis URLs
            </button>
            </a>
            <button
              @click="apiConfigModalOpen = true"
              class="px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-blue-100 transition-colors duration-150"
            >
              Configuración API
            </button>
            <button
              @click="redirectTestModalOpen = true"
              class="px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-blue-100 transition-colors duration-150"
            >
              Probar Redirección
            </button>
          </nav>
          
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-blue-200 hover:text-blue-400 focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white/5 backdrop-blur-sm">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button 
            @click="activeTab = 'shorten'; mobileMenuOpen = false" 
            :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'shorten' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
          >
            Acortar URL
          </button>
          <button 
            @click="activeTab = 'info'; mobileMenuOpen = false" 
            :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'info' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
          >
            Información de URL
          </button>
          <button 
            @click="activeTab = 'myurls'; mobileMenuOpen = false" 
            :class="['block w-full text-left px-3 py-2 rounded-md text-base font-medium', activeTab === 'myurls' ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow' : 'text-blue-200 hover:bg-white/10 hover:text-blue-100']"
          >
            Mis URLs
          </button>
          <button 
            @click="apiConfigModalOpen = true; mobileMenuOpen = false" 
            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-white/10 hover:text-blue-100"
          >
            Configuración API
          </button>
          <button 
            @click="redirectTestModalOpen = true; mobileMenuOpen = false" 
            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-white/10 hover:text-blue-100"
          >
            Probar Redirección
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <section class="text-center mb-12 relative backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-zinc-500/10 to-teal-500/10 pointer-events-none"></div>
        <div class="relative z-10">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300 mb-4 drop-shadow-lg">
            ShortURL: Acortador de Enlaces
          </h1>
          <p class="text-lg text-blue-100 max-w-4xl mx-auto mb-4">
            Este proyecto es un acortador de URLs moderno y eficiente, ideal para compartir enlaces de manera rápida y profesional. Potenciado por Cloudflare Workers para máxima velocidad y confiabilidad.
          </p>
          <div class="flex flex-col items-center gap-2 mb-4">
            <span class="text-blue-300 font-semibold">URL principal del servicio:</span>
            <a href="https://shorturl.roldyoran.workers.dev/" target="_blank" class="text-lg font-mono text-blue-200 hover:text-blue-400 underline transition-all">https://shorturl.roldyoran.workers.dev/</a>
          </div>

          <div class="mt-6">
            <h2 class="text-2xl font-bold text-blue-300 mb-2">URLs cortas disponibles</h2>
            <div class="overflow-x-auto rounded-lg shadow border border-white/10 bg-white/5 backdrop-blur-sm">
              <table class="w-full min-w-max text-sm text-left text-blue-100">
                <thead class="text-xs text-blue-300 uppercase bg-white/10">
                  <tr>
                    <th scope="col" class="px-6 py-3">Código</th>
                    <th scope="col" class="px-6 py-3">Enlace Original</th>
                    <th scope="col" class="px-6 py-3">URL Corta</th>
                    <th scope="col" class="px-6 py-3">Copiar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-white/10 transition-colors border-b border-white/10" v-for="url in visibleUrls" :key="url.code">
                    <td class="px-6 py-4 font-mono">
                      <a :href="baseUrl + url.code" target="_blank" class="text-blue-300 hover:text-blue-400 underline">{{ url.code }}</a>
                    </td>
                    <td class="px-6 py-4 break-all">
                      <a :href="url.original" target="_blank" class="hover:underline text-blue-100 hover:text-blue-300">{{ url.original }}</a>
                    </td>
                    <td class="px-6 py-4 break-all font-mono text-blue-200">
                      <span>{{ baseUrl + url.code }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <button 
                        @click="copyUrl(baseUrl + url.code)" 
                        class="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-400 hover:to-teal-300 text-white font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        Copiar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="p-4 text-center">
                <button 
                  @click="showAllUrls = !showAllUrls" 
                  class="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all"
                >
                  {{ showAllUrls ? 'Mostrar menos' : 'Ver más URLs' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <div class=" space-y-24 my-10" id="main-content">
        <transition name="fade" mode="out-in">
          <div :key="activeTab">
            <ShortenUrl v-if="activeTab === 'shorten'" />
            <UrlInfo v-else-if="activeTab === 'info'" />
            <MyUrls v-else-if="activeTab === 'myurls'" />
          </div>
        </transition>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-blue-900 via-purple-800 to-blue-700 text-blue-200 text-center py-6 mt-auto border-t border-white/10 shadow-inner">
      <p>&copy; {{ new Date().getFullYear() }} ShortURL by roldyoran. Todos los derechos reservados.</p>
      <p class="text-sm">Desarrollado con Vue.js, Tailwind CSS y Cloudflare Workers.</p>
    </footer>
    
    <!-- Copy Notification -->
    <transition name="fade-modal">
      <div v-if="showCopyModal" class="fixed bottom-6 right-6 z-50 backdrop-blur-md bg-white/10 border border-blue-400/30 rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 animate-fade-in-up">
        <svg class="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-blue-100 font-semibold">¡URL copiada al portapapeles!</span>
      </div>
    </transition>
    
    <!-- API Config Modal -->
    <transition name="fade-modal">
      <div v-if="apiConfigModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="relative bg-gray-800 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button 
            @click="apiConfigModalOpen = false" 
            class="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-blue-200 hover:text-blue-100 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="p-6">
            <h2 class="text-2xl font-bold text-blue-300 mb-6">Configuración de la API</h2>
            <ApiConfig />
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Redirect Test Modal -->
    <transition name="fade-modal">
      <div v-if="redirectTestModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="relative bg-gray-800 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button 
            @click="redirectTestModalOpen = false" 
            class="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-blue-200 hover:text-blue-100 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="p-6">
            <h2 class="text-2xl font-bold text-blue-300 mb-6">Probar Redirección</h2>
            <RedirectTest />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onBeforeUnmount, computed } from 'vue'
import ApiConfig from './components/ApiConfig.vue'
import RedirectTest from './components/RedirectTest.vue'
import ShortenUrl from './components/ShortenUrl.vue'
import UrlInfo from './components/UrlInfo.vue'
import MyUrls from './components/MyUrls.vue'

type Tab = 'shorten' | 'info' | 'myurls'

const activeTab = ref<Tab>('shorten')
const mobileMenuOpen = ref(false)
const apiConfigModalOpen = ref(false)
const redirectTestModalOpen = ref(false)
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

const showAllUrls = ref(false)
const visibleUrls = computed(() => {
  return showAllUrls.value ? shortUrls : shortUrls.slice(0, 4)
})

const showCopyModal = ref(false)
let copyModalTimeout: ReturnType<typeof setTimeout> | null = null

function showCopyNotification() {
  showCopyModal.value = true
  if (copyModalTimeout) clearTimeout(copyModalTimeout)
  copyModalTimeout = setTimeout(() => {
    showCopyModal.value = false
  }, 2000)
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

// Particles animation
const particlesCanvas = ref<HTMLCanvasElement|null>(null)
let animationId: number | null = null
let particles: any[] = []

function randomColor() {
  // Azul/teal suave
  const colors = ['rgba(96, 165, 250, 0.7)', 'rgba(45, 212, 191, 0.7)']
  return colors[Math.floor(Math.random() * colors.length)]
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
    ctx.shadowColor = p.color.includes('blue') ? '#3b82f6' : '#2dd4bf'
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
    if (!canvas) return
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
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
window.removeEventListener('resize', () => {
  if (!particlesCanvas.value) return
  const dpr = window.devicePixelRatio || 1
  particlesCanvas.value.width = window.innerWidth * dpr
  particlesCanvas.value.height = window.innerHeight * dpr
  particlesCanvas.value.style.width = window.innerWidth + 'px'
  particlesCanvas.value.style.height = window.innerHeight + 'px'
  particles = createParticles(60, particlesCanvas.value.width, particlesCanvas.value.height)
})
  if (copyModalTimeout) clearTimeout(copyModalTimeout)
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