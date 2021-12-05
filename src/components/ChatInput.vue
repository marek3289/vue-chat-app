<template>
  <form class='relative py-4 px-2 border-t' @submit.prevent="handleSubmit">
    <base-input v-model="value" class='!rounded-full' placeholder='Write something' />
    <base-icon-button
      type='submit'
      icon='paper-plane'
      label='Send Message'
      :isDisabled="!isValid"
      :class="`${!isValid ? 'bg-blue-300' : 'bg-blue-500'} bg-blue-500 text-white absolute right-2 top-4`"
    />
  </form>
</template>

<script setup lang='ts'>
import { ref, watch, computed } from 'vue';

const value = ref('');
const emit = defineEmits(['handleSubmit', 'handleChange'])

const isValid = computed(() => value.value.length > 0);

watch(value, () => emit('handleChange', value.value));

const handleSubmit = () => {
  if (!isValid.value) return;
  emit('handleSubmit', value.value);
  value.value = '';
}
</script>
