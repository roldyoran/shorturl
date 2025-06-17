<template>
  <transition-group name="toast" tag="div" class="fixed bottom-4 right-4 space-y-2 z-50">
    <div
      v-for="(toast) in toasts"
      :key="toast.id"
      :class="[
        'px-4 py-2 rounded-md shadow-lg border-2 backdrop-blur-md ',
        toast.class || 'bg-blue-600'
      ]"
    >
      {{ toast.message }}
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Toast {
	id: number;
	message: string;
	class?: string;
}

interface ToastOptions {
	class?: string;
	duration?: number;
}

const toasts = ref<Toast[]>([]);

function showToast(message: string, options: ToastOptions = {}) {
	const id = Date.now();
	toasts.value.push({ id, message, class: options.class });

	setTimeout(() => {
		toasts.value = toasts.value.filter((t) => t.id !== id);
	}, options.duration || 3000);
}

// Exponer globalmente
defineExpose({ showToast });
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
