<template>
  <li :class="`${message.fromSelf ? 'self-end' : 'self-start'} relative max-w-prose`">
    <p 
      :class="`rounded-lg p-2 px-3 ml-10
      ${message.fromSelf ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}
      ${isLatestMessage && !message.fromSelf && (isLatestMessage || !isTyping) && 'rounded-bl-none'}
      ${isLatestMessage && message.fromSelf && 'rounded-br-none'}`"
    >
      {{message.message}}
    </p>
    <img
      v-if="isLatestMessage && !message.fromSelf && (isLatestMessage || !isTyping)"
      :src="`http://localhost:5000/assets/users/${selectedUser.avatar}.png`"
      :alt="selectedUser.username"
      class="left-0 rounded-full w-[32px] h-[32px] absolute bottom-0"
    />
  </li>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

const { message, isTyping, selectedUser } = defineProps({
  message: Object as any,
  isTyping: Boolean,
  selectedUser: Object as any,
});

const isLatestMessage = computed(() => {
  const idx = selectedUser.messages.indexOf(message);
  return selectedUser.messages[idx + 1] ? selectedUser.messages[idx + 1].fromSelf : true;
})
</script>
