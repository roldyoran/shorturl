<template>
  <transition name="fade-modal">
    <div v-if="show" class="fixed bottom-6 right-6 z-50 backdrop-blur-md bg-white/10 border border-blue-400/30 rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 animate-fade-in-up">
      <svg class="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="text-blue-100 font-semibold">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const message = ref('')

let timeoutId: ReturnType<typeof setTimeout> | null = null

const showNotification = (msg: string, duration = 2000) => {
  message.value = msg
  show.value = true
  
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    show.value = false
  }, duration)
}

// Exponer la función para que pueda ser usada con provide/inject
defineExpose({
  showNotification
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