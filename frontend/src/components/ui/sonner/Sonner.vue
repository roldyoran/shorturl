<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': 'var(--popover)',
      '--success-text': 'var(--popover-foreground)',
      '--success-border': 'var(--border)',
      '--error-bg': 'var(--popover)',
      '--error-text': 'var(--popover-foreground)',
      '--error-border': 'var(--border)',
      '--warning-bg': 'var(--popover)',
      '--warning-text': 'var(--popover-foreground)',
      '--warning-border': 'var(--border)',
      '--info-bg': 'var(--popover)',
      '--info-text': 'var(--popover-foreground)',
      '--info-border': 'var(--border)',
    }"
  />
</template>

<style>
/* Mejorar la legibilidad del texto de descripción en todos los temas */
[data-sonner-toaster] [data-description] {
  color: var(--popover-foreground) !important;
  opacity: 0.8;
}

/* Asegurar que el texto del título sea completamente visible */
[data-sonner-toaster] [data-title] {
  color: var(--popover-foreground) !important;
  opacity: 1;
}

/* Mejorar el contraste en modo oscuro */
.dark [data-sonner-toaster] [data-description] {
  opacity: 0.9 !important;
}

/* Estilos para diferentes tipos de toast */
[data-sonner-toaster] [data-type="success"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="error"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="warning"] [data-description] {
  opacity: 0.85;
}

[data-sonner-toaster] [data-type="info"] [data-description] {
  opacity: 0.85;
}
</style>
