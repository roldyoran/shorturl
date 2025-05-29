<template>
  <transition name="fade-modal">
    <div v-if="show" class="fixed bottom-6 right-6 z-50 backdrop-blur-md bg-white/30 border border-blue-400/30 rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 animate-fade-in-up">
      <svg class="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="text-blue-100 font-semibold">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {  watchEffect, defineProps, defineEmits, onUnmounted } from 'vue'

const props = defineProps<{ 
  show: boolean,
  message?: string 
}>()

const emits = defineEmits(['update:show'])
let timeout: ReturnType<typeof setTimeout> | null = null


watchEffect(() => {
  if (props.show) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      emits('update:show', false)
    }, 2000)
  }
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-modal-enter-to,
.fade-modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>