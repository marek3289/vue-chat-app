<template>
  <div class='h-full flex flex-col w-full md:w-8/12 overflow-hidden border-r border-l bg-white'>
    <div class='p-3 border-b flex flex-row-reverse justify-between items-center h-24'>
      <div>
        <base-icon-button icon='bars' class='md:hidden text-gray-500' @click="handleOpenMenu" />
        <Modal :isOpen="showMenu" @handleClose="handleCloseMenu">
          <MobileMenu :users="props.users" @handleClose="handleCloseMenu" />
        </Modal>
      </div>
      
      <div v-if="selectedUser" class='flex items-center'>
        <img :src="`http://localhost:5000/assets/users/${selectedUser.avatar}.png`" :alt="selectedUser.username" class='rounded-full w-[48px] h-[48px]' />
        <p class='font-bold text-gray-600 line-clamp-1 pl-4 pr-2'>{{selectedUser.username}}</p>
        <div :class="[selectedUser.connected ? 'bg-green-400' : 'bg-gray-400', 'w-[16px] h-[16px] rounded-full border-2 inset-3/4']" />
      </div>
    </div>

    <div class='w-full h-full overflow-y-scroll flex flex-col-reverse'>
      <ul v-if="selectedUser && selectedUser.messages.length" class='flex flex-col py-3 justify-end px-2 space-y-1'>
        <Message
          v-for="(message, index) in selectedUser.messages"
          :key="index"
          :message="message"
          :isTyping="selectedUser.typing"
          :selectedUser="selectedUser"
        />

        <div v-if="selectedUser.typing" class='relative self-start max-w-prose'>
          <div class='bg-gray-200 rounded-bl-none p-2 px-3 ml-10 rounded-xl'>
            <div class="snippet p-2 px-3" data-title=".dot-elastic">
              <div class="stage">
                <div class="dot-elastic"></div>
              </div>
            </div>
          </div>
          <img :src="`http://localhost:5000/assets/users/${selectedUser.avatar}.png`" :alt="selectedUser.username" class="left-0 rounded-full w-[32px] h-[32px] absolute bottom-0" />
        </div>
      </ul>

      <div v-else-if="!selectedUser" class='w-full h-full grid place-items-center place-content-center gap-6 pb-72'>
        <fa icon="comments" size="6x" class='text-blue-500' />
        <p class='text-gray-600 text-lg font-bold'>No user selected</p>
      </div>
      <div v-else class='w-full h-full grid place-items-center place-content-center gap-6 pb-72'>
        <fa icon="comments" size="6x" class='text-blue-500' />
        <p class='text-gray-600 text-lg font-bold'>Write your first message</p>
      </div>
    </div>

    <ChatInput @handleSubmit="handleSubmit" @handleChange="handleChange" />
  </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import ChatInput from '@/components/ChatInput.vue';
import Message from '@/components/Message.vue';
import Modal from '@/components/Modal.vue';
import MobileMenu from '@/components/MobileMenu.vue';
import socket from '../socket';

const props = defineProps(['users', 'selectedUser']);
const selectedUser = computed(() => props.selectedUser);
const showMenu = ref(false);

const emit = defineEmits(['handleSubmit', 'handleChange'])

const handleChange = (message: string) => emit('handleChange', message);
const handleSubmit = (message: string) => emit('handleSubmit', message);
const handleOpenMenu = () => showMenu.value = true;
const handleCloseMenu = () => showMenu.value = false;
</script>
