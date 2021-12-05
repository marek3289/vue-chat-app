<template>
  <div :class="`${isOpen ? 'block' : 'hidden'} fixed left-0 top-0 w-full h-full bg-white z-50 md:hidden`">
    <div class='w-full h-16'>
      <base-icon-button icon='times' class='text-gray-500 absolute top-3 right-3' @click='handleCloseModal' />
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['handleClose'])
const handleCloseModal = () => emit('handleClose');
</script>:
