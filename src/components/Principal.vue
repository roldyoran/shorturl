<template>
  <!-- Hero Section -->
  <section class="text-center mb-12">
    <Card class="p-8">
      <CardContent class="space-y-6">
        <div class="space-y-4">
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

        <div class="space-y-4">
          <div class="flex items-center justify-center gap-2">
            <Globe class="w-5 h-5 text-primary" />
            <span class="font-semibold">Servicio Principal</span>
          </div>

          <div class="max-w-3xl mx-auto w-full">
            <div class="flex flex-col md:flex-row items-center md:items-stretch gap-3 p-3 rounded-lg border bg-muted/50">
              <!-- URL area (looks like an input, selectable, tappable to copy) -->
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

              <!-- Buttons: stacked on mobile, inline on desktop -->
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

            <p class="text-xs text-muted-foreground text-center mt-2">
              Toca la URL para copiar rápidamente.
            </p>
            
            <!-- Botón temporal para pruebas -->
            <!-- <div class="text-center mt-4">
              <Button 
                variant="secondary" 
                size="sm"
                @click="testToast"
                class="text-xs"
              >
                🧪 Test Toast
              </Button>
            </div> -->
          </div>
        </div>

        <Separator />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
import { Zap, Globe, ExternalLink, Copy, Shield, BarChart3, Brush } from "lucide-vue-next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Test function para verificar que los toasts funcionan
const testToast = () => {
  toast('¡Test exitoso!', {
    description: 'Los toasts están funcionando correctamente',
    action: {
      label: 'Genial',
      onClick: () => console.log('Toast test completado'),
    },
  })
}
</script>