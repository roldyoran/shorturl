<template>
  <div>
    <DialogHeader>
      <DialogTitle class="flex items-center gap-3">
        <ExternalLink class="w-6 h-6" />
        Probar Redirección
      </DialogTitle>
      <DialogDescription>
        Ingresa el código de una URL corta para probar la redirección a la URL original
      </DialogDescription>
    </DialogHeader>

    <div class="space-y-6 mt-6">
      <div class="space-y-2">
        <Label for="redirect-url">Código de URL Corta</Label>
        <Input 
          id="redirect-url"
          v-model="shortCode"
          placeholder="Ej: abc123xyz"
          type="text"
        />
      </div>

      <div class="space-y-4">
        <Button 
          @click="redirectToUrl"
          :disabled="!shortCode.trim()"
          class="w-full"
        >
          <ExternalLink class="w-4 h-4 mr-2" />
          Ir a URL Original
        </Button>

        <!-- Mostrar la URL completa que se abrirá -->
        <div v-if="shortCode.trim()" class="p-3 rounded-lg border bg-muted/50">
          <p class="text-sm text-muted-foreground mb-1">URL de redirección:</p>
          <p class="font-mono text-sm break-all">{{ getRedirectUrl() }}</p>
        </div>
      </div>

      <Alert v-if="error" variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <Alert>
        <Info class="h-4 w-4" />
        <AlertTitle>¿Cómo funciona?</AlertTitle>
        <AlertDescription>
          Este probador abre la URL corta en una nueva pestaña. Si el código existe, serás redirigido automáticamente a la URL original.
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ExternalLink, AlertCircle, Info } from "lucide-vue-next";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "vue-sonner";
import { getApiBaseUrl } from "@/api/http";

// Estado reactivo
const shortCode = ref<string>("")
const error = ref<string>("")

// Methods
const getRedirectUrl = (): string => {
  if (!shortCode.value.trim()) return ""
  
  const base = getApiBaseUrl().replace(/\/$/, "");
  return `${base}/${shortCode.value.trim()}`
}

const redirectToUrl = async () => {
  error.value = ""
  
  if (!shortCode.value.trim()) {
    error.value = "Por favor ingresa el código de la URL corta."
    return
  }

  try {
    const redirectUrl = getRedirectUrl()
    
    // Abrir en nueva pestaña
    const newWindow = window.open(redirectUrl, "_blank")
    
    if (newWindow) {
      toast.success(
        "Redirección iniciada", 
        {
          description: "Se ha abierto una nueva pestaña con la URL corta",
        }
      )
      
      // Limpiar el campo después de la redirección exitosa
      setTimeout(() => {
        shortCode.value = ""
      }, 1000)
    } else {
      error.value = "No se pudo abrir la nueva pestaña. Verifica que no esté bloqueada por el navegador."
    }
  } catch (e: any) {
    console.error("Error al intentar abrir la URL:", e)
    error.value = "Error al intentar abrir la URL. Verifica la consola para más detalles."
    toast.error(
      "Error de redirección",
      {
        description: "No se pudo abrir la URL de redirección",
      }
    )
  }
}
</script>