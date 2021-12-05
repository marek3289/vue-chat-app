<template>
  <div class='h-full w-full overflow-auto'>
    <div class='w-full flex items-center py-2 px-4'>
      <img :src="`http://localhost:5000/assets/users/${currentUser.avatar}.png`" :alt='currentUser.username' class='rounded-full w-[64px] h-[64px] mr-4' />
      <div class='w-full'>
        <div class='flex items-center justify-between'>
          <h1 class='text-blue-500 text-lg font-bold'>{{currentUser.username}}</h1>
        </div>
        <p v-if="currentUser.description" class='text-sm font-medium text-gray-600 line-clamp-1'>{{currentUser.description}}</p>
        <p v-else class='text-sm font-medium text-gray-600 line-clamp-1 italic cursor-pointer hover:underline'>Add description</p>
      </div>
      
      <base-icon-button icon='sign-out-alt' class='text-gray-500' @click='handleLogout' />
    </div>

    <div class='relative p-4'>
      <base-input type='serach' class='pl-10 !rounded-full' name="search" v-model="search" placeholder='Serach'>
        <fa icon='search' class="absolute h-4 bg-color-100 text-gray-400 inset-y-0.5 inset-x-3.5" />
      </base-input>
    </div>

    <ul v-if="userList.length" class='space-y-4'>
      <User v-for="user in userList" :key="user.userID" :user="user" @click="handleClose" />
    </ul>
    <p v-else class='text-center'>No users found</p>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import { AuthTypes } from '@/utils/types';
import { MAIN } from '@/router/constants';
import User from '@/components/User.vue'

const router = useRouter();
const store = useStore();

const emit = defineEmits(['handleClose'])
const { users } = defineProps({
  users: {
    type: Array as unknown as any[],
    required: true,
  },
});

const currentUser = store.getters.getCurrentUser;
const search = ref('');

const userList = computed(() => {
  const filteredBySearch = search.value !== '' ? users.filter((u: any) => u.username.includes(search.value)) : users
  return filteredBySearch.filter((u:any)=> u.self !== true);
})

const handleClose = () => emit('handleClose');

const handleLogout = async () => {
  await store.dispatch(AuthTypes.LOGOUT);
  router.push({ name: MAIN.LOGIN.name })
  emit('handleClose');
} 

</script>
