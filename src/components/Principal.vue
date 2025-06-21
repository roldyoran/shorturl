<template>
    <!-- Hero Section -->
      <section class="text-center mb-12 relative backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/5 overflow-hidden bg-zinc-950/60">
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
            <div class="bg-zinc-800 px-2 md:px-6 rounded-full py-1">
                <a href="https://shorturl.roldyoran.workers.dev/" target="_blank" class=" font-mono text-sm  md:text-2xl text-cyan-400 hover:text-cyan-300 hover:underline transition-all">https://shorturl.roldyoran.workers.dev/</a>
            </div>
          </div>
        </div>
      </section>
</template>

<script setup lang="ts">
</script>