<!-- Dialog.vue -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center sm:items-center pt-16 sm:pt-0">
      <div class="fixed inset-0 bg-black/80 backdrop-blur-xs" @click="$emit('update:modelValue', false)" />
      <div class="relative z-50">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">

defineProps({
  modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>