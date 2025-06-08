<!-- Dialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center sm:items-center pt-16 sm:pt-0">
        <Transition name="fade">
          <div 
            v-if="modelValue"
            class="fixed inset-0 bg-black/80 backdrop-blur-xs" 
            @click="$emit('update:modelValue', false)"
          />
        </Transition>
        
        <Transition name="modal">
          <div v-if="modelValue" class="relative z-50">
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Animación de fade para el fondo */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación para el modal */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>