<template>
  <button class='grid place-items-center h-[38px] w-[38px] rounded-full' :aria-disabled="isDisabled">
    <fa :aria-hidden="true" :icon="icon" />
    <span class='sr-only'>{{label}}</span>
  </button>
</template>

<script lang='ts'>
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "BaseIconButton",
  props: ['icon', 'label', 'isDisabled']
});
</script>
