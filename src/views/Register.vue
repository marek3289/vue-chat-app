<template>
  <div class='h-full grid place-items-center bg-gradient-to-r from-light-blue-400 to-indigo-500'>
    <form @submit='handleSubmit' class='w-full max-w-sm bg-white p-8 rounded-xl shadow-md space-y-6'>
      <h1 class='text-center pb-16 p-4 text-gray-700 text-3xl font-bold '>Vue Chat App</h1>
      <base-input name="username" label="Username" v-model="form.username" />
      <base-input type='password' :name="'password'" :label="'Password'" v-model="form.password" />
      <base-input type='password' :name="'repeat-password'" :label="'Repeat password'" v-model="form.repeatPassword" />
      <p v-if="state.status === 'failure'" class='text-red-400 font-medium'>{{state.error}}</p>
      <div class='flex items-center justify-between'>
        <button type='submit' class='btn btn--primary' :disabled="state.status === 'loading'">{{state.status === 'loading' ? 'Loading...' : 'Sign Up'}}</button>
        <router-link :to="{ name: 'login' }" class='btn btn--secondary'>Login</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import { MAIN } from '@/router/constants';
import { AuthTypes } from '@/utils/types';

const router = useRouter();
const store = useStore();
const form = reactive({ username: '', password: '', repeatPassword: '' });
const state = reactive({ status: 'idle', error: '' });

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  state.status = 'loading';
  state.error = '';

  try {
    const user = await store.dispatch(AuthTypes.REGISTER, form);
    state.status = 'success';
    if (user) router.push({ name: MAIN.HOME.name });
  } catch (err: any) {
    state.status = 'failure';
    state.error = err.message;
  }
}
</script>
