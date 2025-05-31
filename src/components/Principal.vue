<template>
    <!-- Hero Section -->
      <section class="text-center mb-12 relative backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/5 overflow-hidden bg-zinc-900/60">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-zinc-900/10 to-teal-900/10 pointer-events-none"></div>
        <div class="relative z-10">
          <h1 class="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l to-purple-500  via-cyan-500 from-teal-400 mb-4 drop-shadow-lg">
            ShortURL: Acortador de Enlaces
          </h1>
          <p class="text-md text-zinc-300/70 max-w-4xl mx-auto mb-4 text-wrap">
            Acortador de URLs moderno y eficiente, ideal para compartir enlaces largo de manera rápida y profesional. <br> Potenciado por Cloudflare Workers para máxima velocidad y confiabilidad.
          </p>
          <div class="flex flex-col items-center gap-2 mb-4 mt-8">
            <span class="text-zinc-300 font-semibold">Servicio Principal:</span>
            <div class="bg-zinc-800 px-6 rounded-full py-1">
                <a href="https://shorturl.roldyoran.workers.dev/" target="_blank" class=" font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-all">https://shorturl.roldyoran.workers.dev/</a>

            </div>
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-bold mb-2">URLs cortas Disponibles</h2>
            <div class="overflow-x-auto rounded-lg shadow border border-white/10 bg-zinc-600/20 backdrop-blur-sm">
              <table class="w-full min-w-max text-sm text-left ">
                <thead class="text-xs text-purple-300 uppercase">
                  <tr>
                    <th scope="col" class="px-6 py-3">Código</th>
                    <th scope="col" class="px-6 py-3">Enlace Original</th>
                    <th scope="col" class="px-6 py-3">URL Corta</th>
                    <th scope="col" class="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-white/5 transition-colors border-b border-white/10" v-for="url in visibleUrls" :key="url.code">
                    <td class="px-6 py-4 font-mono">
                      <a :href="baseUrl + url.code" target="_blank" class="text-cyan-400 hover:text-cyan-300 hover:underline transition-all ">{{ url.code }}</a>
                    </td>
                    <td class="px-6 py-4 break-all">
                      <a :href="url.original" target="_blank" class="hover:underline text-zinc-300 transition-all hover:text-cyan-300">{{ url.original }}</a>
                    </td>
                    <td class="px-6 py-4 break-all font-mono text-cyan-200">
                      <a :href="baseUrl + url.code" target="_blank" class="text-cyan-400 hover:text-cyan-300 hover:underline transition-all">
                        <span>{{ baseUrl + url.code }}</span>
                       </a>
                    </td>
                    <td class="px-6 py-4">
                      <button
                      @click="copyToClipboard(baseUrl + url.code)"
                        class="flex items-center text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-md text-sm"
                      >
                        <Copy class="inline-block mr-2 w-4 h-4" />
                        Copiar
                    </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="p-4 text-center">
                <button 
                @click="showAllUrls = !showAllUrls"
                class="px-4 py-2 rounded-md  text-white/50 hover:text-zinc-200 font-medium transition-all"
                >
                  <ArrowDown v-if="!showAllUrls" class="inline-block w-6 h-6 text-purple-400 mb-2" />
                  <ArrowUp v-else class="inline-block w-6 h-6 text-purple-400 mb-2" />  
                
                  {{ showAllUrls ? 'Mostrar menos' : 'Ver más URLs' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { copyToClipboard } from '../utils/copyUrl';
import { ArrowUp, ArrowDown, Copy } from 'lucide-vue-next';

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



// const copyToClipboard = (text: string) => {
//   navigator.clipboard.writeText(text).then(() => {
//     window.$toast('¡Enlace copiado al portapapeles!', { class: 'bg-teal-700' })
//   }).catch(err => {
//     console.error('Error al copiar al portapapeles:', err)
//     window.$toast('Error al copiar el enlace', { class: 'bg-red-500' })
//   })
// }


</script>