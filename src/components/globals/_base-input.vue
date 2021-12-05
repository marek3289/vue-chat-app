<template>
  <label :for="name" class="relative text-gray-700 text-base font-medium focus-within:text-blue-500">
    {{ label }}
    <input
      :class="`${Boolean(label) ? 'mt-2' : ''} w-full py-2 px-3 border rounded-sm text-base text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`"
      :name="name"
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target.value)"
      type='text'
      v-bind="$attrs"
    />
    <slot></slot>
  </label>
</template>

<script lang='ts'>
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "BaseInput",
  inheritAttrs: false,
  props: ['name', 'label', 'modelValue'],
});
</script>
