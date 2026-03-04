<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'

const mode = useColorMode()
const buttonRef = ref<HTMLElement>()

const currentIcon = computed(() => {
  switch (mode.value) {
    case 'dark':
      return Moon
    case 'light':
      return Sun
    default:
      return Monitor
  }
})

const toggleTheme = async (event: MouseEvent) => {
  // Si el navegador no soporta View Transitions, cambiar directamente
  if (!document.startViewTransition) {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    return
  }

  // Obtener las coordenadas del click
  const x = event.clientX
  const y = event.clientY
  
  // Calcular el radio más grande desde el punto de click hasta cualquier esquina
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  // Iniciar la transición con animación circular
  const transition = document.startViewTransition(() => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  })

  await transition.ready

  // Animar el círculo expandiéndose desde el punto de click
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]
    },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)'
    }
  )
}

// Exponer la función para que se pueda llamar desde el padre
defineExpose({
  toggleTheme,
})
</script>

<template>
  <Button
    ref="buttonRef"
    variant="outline"
    size="sm"
    class="h-9 w-9 p-0"
    @click="toggleTheme"
    :title="mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'"
  >
    <component :is="currentIcon" class="h-4 w-4 transition-transform hover:scale-110" />
  </Button>
</template>

<style>
/* View Transition API styles para animación circular */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}
</style>