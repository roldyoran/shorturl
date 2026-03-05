<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'

const { toast, showSuccess, showError, showWarning, showInfo, showPromise } = useToast()

// Función para simular una operación asíncrona
const simulateAsyncOperation = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('URL acortada'), 2000)
  })
}

const handlePromiseToast = () => {
  const promise = simulateAsyncOperation()
  
  showPromise(promise, {
    loading: 'Acortando URL...',
    success: 'URL acortada correctamente',
    error: 'Error al acortar URL',
  })
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Sonner Test</h3>
    <div class="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        @click="() => {
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }"
      >
        Basic Toast
      </Button>

      <Button
        variant="outline"
        @click="() => showSuccess('URL acortada correctamente', {
          description: 'Tu nueva URL está lista para usar',
        })"
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        @click="() => showError('Error al acortar URL', {
          description: 'Por favor, verifica la URL e inténtalo de nuevo',
        })"
      >
        Error Toast
      </Button>

      <Button
        variant="outline"
        @click="() => showWarning('Advertencia', {
          description: 'Esta acción no se puede deshacer',
        })"
      >
        Warning Toast
      </Button>

      <Button
        variant="outline"
        @click="() => showInfo('Información', {
          description: 'Esta es una notificación informativa',
        })"
      >
        Info Toast
      </Button>

      <Button
        variant="outline"
        @click="handlePromiseToast"
      >
        Promise Toast
      </Button>
    </div>
  </div>
</template>