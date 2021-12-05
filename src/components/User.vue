<template>
  <li>
    <router-link :to="{ name: 'chat', params: { username: user.username } }">
      <div class='w-full flex hover:bg-gray-200 cursor-pointer py-2 px-4'>
        <div class='mr-4 flex-none relative  w-[48px] h-[48px]'>
          <img :src="`http://localhost:5000/assets/users/${user.avatar}.png`" :alt="user.username " class='rounded-full w-[48px] h-[48px]' />
          <div :class="[user.connected ? 'bg-green-400' : 'bg-gray-400', 'absolute w-[16px] h-[16px] rounded-full border-2 inset-3/4']" />
        </div>

        <div class='w-full h-[48px]'>
          <div class='flex justify-between items-baseline'>
            <p class='font-bold text-blue-500 line-clamp-1'>{{user.username}}</p>
            <p v-if="lastMessage" class='text-xs font-bold text-gray-400 line-clamp-1'>{{lastMessageTime}}</p>
          </div>

          <div v-if="lastMessage" class='flex justify-between items-center'>
            <p class='text-sm line-clamp-1'>
              <span v-if="user.typing" class='text-gray-400'>Typing...</span>
              <span v-else :class="`${lastMessage.seen || lastMessage.fromSelf ? 'font-medium' : 'font-bold'} text-gray-600`">
                {{lastMessage.fromSelf ? 'You:' : ''}} {{lastMessage.message}}
              </span>
            </p>
            <div v-if="user.newMessagesCount !== 0" class='grid place-items-center flex-none text-xs font-bold text-white bg-blue-500 w-[21px] h-[21px] rounded-full'>
              {{user.newMessagesCount}}
            </div>
          </div>
          <div v-else>
            <p class='text-sm font-medium text-gray-400 line-clamp-1'>
              <span v-if="user.typing">Typing...</span>
              <span v-else>Write your first message!</span>
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </li>
</template>


<script setup lang='ts'>
import { computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { user } = defineProps({
  user: {
    type: Object as any,
    required: true,
  },
});

const lastMessage = computed(() => user.messages[user.messages.length -1]);
const lastMessageTime = computed(() => lastMessage.value.timestamp && dayjs(lastMessage.value.timestamp).fromNow(true));
</script>
