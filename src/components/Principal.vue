<template>
  <!-- Hero Section -->
  <section class="text-center mb-8 md:mb-12">
    <Card class="p-4 md:p-8">
      <CardContent class="space-y-4 md:space-y-6">
        <!-- Mobile: Simplified header -->
        <div class="block md:hidden space-y-3">
          <Badge variant="secondary" class="text-xs">
            <Zap class="w-3 h-3 mr-1" />
            Cloudflare Workers
          </Badge>

          <h1 class="text-2xl font-bold">
            ShortURL
          </h1>

          <p class="text-sm text-muted-foreground leading-relaxed">
            Acortador de URLs rápido y seguro
          </p>
        </div>

        <!-- Desktop: Full header -->
        <div class="hidden md:block space-y-4">
          <Badge variant="secondary" class="mb-4">
            <Zap class="w-3 h-3 mr-1" />
            Powered by Cloudflare Workers
          </Badge>

          <h1 class="text-3xl sm:text-5xl font-extrabold mb-4">
            ShortURL: Acortador de Enlaces
          </h1>

          <p class="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Acortador de URLs moderno y eficiente, ideal para compartir enlaces largos de manera rápida y profesional.
            Potenciado por Cloudflare Workers para máxima velocidad y confiabilidad.
          </p>
        </div>

        <Separator />

        <!-- Service URL section - simplified on mobile -->
        <div class="space-y-3 md:space-y-4">
          <div class="flex items-center justify-center gap-2">
            <Globe class="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span class="text-sm md:text-base font-semibold">Servicio Principal</span>
          </div>

          <div class="max-w-3xl mx-auto w-full">
            <!-- Mobile: Simplified URL display -->
            <div class="block md:hidden">
              <div class="flex flex-col gap-2 p-2 rounded-lg border bg-muted/50">
                <label
                  class="font-mono text-xs truncate text-center px-2 py-2 bg-card rounded-md cursor-pointer select-all"
                  :title="SERVICE_URL"
                  role="button"
                  tabindex="0"
                  @click="copyServiceUrl"
                  @keydown.enter.prevent="copyServiceUrl"
                >
                  {{ SERVICE_URL }}
                </label>
                
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full text-xs"
                  @click="copyServiceUrl"
                  aria-label="Copiar URL del servicio"
                >
                  <Copy class="w-3 h-3 mr-1" />
                  Copiar URL
                </Button>
              </div>
            </div>

            <!-- Desktop: Full URL display -->
            <div class="hidden md:block">
              <div class="flex flex-col md:flex-row items-center md:items-stretch gap-3 p-3 rounded-lg border bg-muted/50">
                <label
                  class="flex-1 min-w-0 font-mono text-sm md:text-base truncate text-center md:text-left px-3 py-2 bg-card rounded-md cursor-pointer select-all"
                  :title="SERVICE_URL"
                  role="button"
                  tabindex="0"
                  @click="copyServiceUrl"
                  @keydown.enter.prevent="copyServiceUrl"
                >
                  {{ SERVICE_URL }}
                </label>

                <div class="flex w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 flex-col md:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    class="w-full md:w-auto"
                    @click="openServiceUrl"
                    aria-label="Abrir servicio en nueva pestaña"
                  >
                    <ExternalLink class="w-4 h-4 mr-1" />
                    Abrir
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    class="w-full md:w-auto"
                    @click="copyServiceUrl"
                    aria-label="Copiar URL del servicio"
                  >
                    <Copy class="w-4 h-4 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
            </div>

            <p class="text-xs text-muted-foreground text-center mt-2">
              Toca la URL para copiar rápidamente.
            </p>
          </div>
        </div>

        <Separator class="hidden md:block" />

        <!-- Features section - simplified on mobile -->
        <div class="block md:hidden mt-4">
          <div class="flex justify-center gap-4 text-center">
            <div class="flex flex-col items-center space-y-1">
              <Zap class="w-5 h-5 text-primary" />
              <span class="text-xs font-medium">Rápido</span>
            </div>
            <div class="flex flex-col items-center space-y-1">
              <Brush class="w-5 h-5 text-primary" />
              <span class="text-xs font-medium">Personalizable</span>
            </div>
            <div class="flex flex-col items-center space-y-1">
              <BarChart3 class="w-5 h-5 text-primary" />
              <span class="text-xs font-medium">Analytics</span>
            </div>
          </div>
        </div>

        <!-- Desktop: Full features -->
        <div class="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
            <Zap class="w-8 h-8 text-primary" />
            <h3 class="font-semibold">Súper Rápido</h3>
            <p class="text-sm text-muted-foreground text-center">
              Redirecciones instantáneas con Cloudflare Workers
            </p>
          </div>
          
          <div class="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
            <Brush class="w-8 h-8 text-primary" />
            <h3 class="font-semibold">Personalizable</h3>
            <p class="text-sm text-muted-foreground text-center">
              Elige un hash personalizado para tu enlace (ej: <span class="font-mono">mi-enlace</span>).
              Esta opción permite URLs más legibles y memorables.
            </p>
          </div>
          
          <div class="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
            <BarChart3 class="w-8 h-8 text-primary" />
            <h3 class="font-semibold">Analytics</h3>
            <p class="text-sm text-muted-foreground text-center">
              Seguimiento de clicks y estadísticas detalladas
            </p>
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

// Note: removed unused test helper `testToast` and `Input` import
</script>