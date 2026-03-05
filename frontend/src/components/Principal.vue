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
            <Zap class="w-3 h-3 mr-1 inline" aria-hidden="true" />
            Powered by Cloudflare Workers
          </Badge>

          <h1 id="hero-title" class="mt-2 md:mt-3 text-xl md:text-2xl font-display font-semibold md:font-bold tracking-tight text-balance">
            <span class="md:hidden">ShortURL</span>
            <span class="hidden md:inline">ShortURL: Acortador de Enlaces</span>
          </h1>

          <p class="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto text-pretty">
            <span class="md:hidden">Acortador de URLs rápido y seguro</span>
            <span class="hidden md:inline">Acorta enlaces de forma rápida y profesional.</span>
          </p>
        </div>

        <Separator class="opacity-50 my-2" />

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
            <Button variant="outline" size="sm" class="shrink-0 h-7 text-xs" @click="copyServiceUrl" aria-label="Copiar URL del servicio">
              <Copy class="w-3 h-3 md:mr-1" aria-hidden="true" />
              <span class="hidden md:inline">Copiar</span>
            </Button>
            <Button variant="ghost" size="sm" class="shrink-0 h-7 text-xs" @click="openServiceUrl" aria-label="Abrir servicio">
              <ExternalLink class="w-3 h-3" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <!-- Features: una sola fila compacta (sin cards grandes) -->
        <div class="hero-item flex flex-wrap justify-center gap-4 md:gap-6 pt-1 text-muted-foreground" style="--delay: 220ms">
          <span class="inline-flex items-center gap-1.5 text-xs">
            <Zap class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Rápido
          </span>
          <span class="inline-flex items-center gap-1.5 text-xs">
            <Brush class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Personalizable
          </span>
          <span class="inline-flex items-center gap-1.5 text-xs">
            <BarChart3 class="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            Analytics
          </span>
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
import { Separator } from "@/components/ui/separator";
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