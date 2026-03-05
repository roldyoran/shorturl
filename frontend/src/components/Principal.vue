<template>
  <!-- Hero compacto: prioridad a la funcionalidad (tabs/form) -->
  <section
    class="hero-stagger text-center mb-4 md:mb-6"
    aria-labelledby="hero-title"
  >
    <Card class="p-3 md:p-5 overflow-hidden border-border shadow-sm">
      <CardContent class="space-y-3 md:space-y-4 relative">
        <div class="hero-item" style="--delay: 80ms">
          <Badge variant="secondary" class="text-xs font-medium">
            <svg class="w-4 h-4 mr-1 inline" viewBox="0 0 256 231" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="currentColor" d="m65.82 3.324 30.161 54.411-27.698 49.857a16.003 16.003 0 0 0 0 15.573l27.698 49.98-30.16 54.411a32.007 32.007 0 0 1-13.542-12.74L4.27 131.412a32.13 32.13 0 0 1 0-32.007l48.01-83.403a32.007 32.007 0 0 1 13.542-12.68Z"/>
              <path fill="currentColor" d="m203.696 16.003 48.01 83.403c5.725 9.848 5.725 22.159 0 32.007l-48.01 83.402a32.007 32.007 0 0 1-27.698 16.004h-48.01l59.705-107.654a16.003 16.003 0 0 0 0-15.511L127.988 0h48.01a32.007 32.007 0 0 1 27.698 16.003Z" opacity="0.6"/>
              <path fill="currentColor" d="M79.978 230.819c-4.924 0-9.849-1.17-14.157-3.263l59.212-106.792a11.045 11.045 0 0 0 0-10.71L65.821 3.324A32.007 32.007 0 0 1 79.978 0h48.01l59.705 107.654a16.003 16.003 0 0 1 0 15.51L127.988 230.82h-48.01Z" opacity="0.8"/>
            </svg>
            Powered by Cloudflare Workers
          </Badge>

          <h1 id="hero-title" class="mt-2 md:mt-3 text-3xl md:text-4xl font-display font-semibold md:font-bold tracking-wide text-balance">
            <span class="md:hidden">ShortURL</span>
            <span class="hidden md:inline">ShortURL: Acortador de Enlaces</span>
          </h1>
          
          <p class="text-xs text-muted-foreground mb-2">by roldyoran</p>

          <p class="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto text-pretty">
            <span class="md:hidden">Acortador de URLs rápido y seguro</span>
            <span class="hidden md:inline">Acorta enlaces de forma rápida y profesional.</span>
          </p>
        </div>

        <!-- Servicio: una línea compacta -->
        <div class="hero-item flex flex-wrap items-center justify-center gap-2 md:gap-3" style="--delay: 160ms">
          <Globe class="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span class="text-xs md:text-sm font-medium text-muted-foreground">Servicio:</span>
          <div class="flex flex-1 min-w-0 max-w-md items-center gap-2">
            <label
              class="flex-1 min-w-0 font-mono text-xs truncate px-2 py-1.5 rounded border bg-muted/50 cursor-pointer select-all"
              :title="SERVICE_URL"
              role="button"
              tabindex="0"
              @click="copyServiceUrl"
              @keydown.enter.prevent="copyServiceUrl"
              @keydown.space.prevent="copyServiceUrl"
            >
              {{ SERVICE_URL }}
            </label>
            <Button variant="outline" size="sm" class="shrink-0 h-7 text-xs rounded-sm" @click="copyServiceUrl" aria-label="Copiar URL del servicio">
              <Copy class="w-3 h-3 md:mr-1" aria-hidden="true" />
              <span class="hidden md:inline">Copiar</span>
            </Button>
            <Button variant="ghost" size="sm" class="shrink-0 h-7 text-xs" @click="openServiceUrl" aria-label="Abrir servicio">
              <ExternalLink class="w-3 h-3" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <!-- Features: una sola fila compacta (sin cards grandes) -->
        <div class="hero-item flex flex-wrap justify-center items-center gap-4 md:gap-6 pt-1 text-muted-foreground" style="--delay: 220ms">
          <div class="inline-flex flex-col items-center gap-0.5 text-xs text-center">
            <span class="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Zap class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              Súper Rápido
            </span>
            <span class="text-[10px] md:text-xs text-muted-foreground">Redirecciones instantáneas</span>
          </div>
          <div class="inline-flex flex-col items-center gap-0.5 text-xs text-center">
            <span class="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Brush class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              Personalizable
            </span>
            <span class="text-[10px] md:text-xs text-muted-foreground">Elige tu propio hash</span>
          </div>
          <div class="inline-flex flex-col items-center gap-0.5 text-xs text-center">
            <span class="inline-flex items-center gap-1.5 font-medium text-foreground">
              <BarChart3 class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              Estadísticas
            </span>
            <span class="text-[10px] md:text-xs text-muted-foreground">Estadísticas detalladas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { Zap, Globe, ExternalLink, Copy, BarChart3, Brush } from "lucide-vue-next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import { toast } from "vue-sonner";
import { getApiBaseUrl } from "@/api/http";

// Composables
const { copyToClipboard } = useCopyToClipboard()

// Constants
const SERVICE_URL = getApiBaseUrl();

// Methods
const openServiceUrl = () => {
  window.open(SERVICE_URL, '_blank')
  toast.success('Servicio abierto', {
    description: 'Se ha abierto el servicio principal en una nueva pestaña'
  })
}

const copyServiceUrl = () => {
  copyToClipboard(SERVICE_URL, 'URL del servicio copiada')
}

</script>

<style scoped>
/* Staggered hero reveal: transform + opacity only (compositor-friendly) */
.hero-item {
  opacity: 0;
  transform: translateY(12px);
  animation: heroReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay, 0ms);
}
@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>