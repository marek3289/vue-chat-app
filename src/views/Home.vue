<template>
  <main class='container mx-auto h-full flex'>
    <ContactList :users="userList" />
    <Chat :users="userList" :selectedUser="selectedUser" @handleSubmit="handleSubmit" @handleChange="handleChange" />
  </main>
</template>

<script setup lang='ts'>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from "vue-router";
import Chat from '@/components/Chat.vue';
import ContactList from '@/components/ContactList.vue';
import useSocket from '@/composables/useSocket';
import { IMessage, IUser } from '@/utils/types.ts';
import socket from '../socket';

useSocket();
const route = useRoute();
const userList = ref<IUser[]>([]);

const sortUserList = () => {
  const sortedArr = userList.value.sort((a: IUser, b: IUser) => {
    const firstMessage: IMessage | null = a.messages[a.messages.length - 1] || null;
    const secondMessage: IMessage | null = b.messages[b.messages.length - 1] || null;

    if (!firstMessage || !firstMessage.timestamp) {
      return 1;
    }
    
    else if (!secondMessage || !secondMessage.timestamp) {
      return -1;
    }

    if (firstMessage.timestamp > secondMessage.timestamp) return -1;
    return firstMessage.timestamp < secondMessage.timestamp ? 1 : 0;
  });

  userList.value = sortedArr;
}

const selectedUser: any = ref(null);

watch(() => route.params.username, (username) => {
  const user: any = username && userList.value.find((u: IUser) => u.username === username);
  socket.emit("seen", user.userID);
  selectedUser.value = user ? user : null;
})

watch(userList.value, () => {
  const user = route.params.username && userList.value.find((u: IUser) => u.username === route.params.username);
  selectedUser.value = user ? user : null;
})

watch(userList.value, () => sortUserList());

const handleChange = (message: string) => {
  if (selectedUser.value && message !== '') {
    socket.emit("typing", selectedUser.value.userID);
  }
}

const handleSubmit = (message: string) => {
  if (!selectedUser.value) return;

  const newMessage = { message, to: selectedUser.value.userID, timestamp: Date.now() };
  socket.emit("private-message", newMessage);
  socket.emit("stop-typing", selectedUser.value.userID);
  selectedUser.value.messages.push({ ...newMessage, fromSelf: true });
}

const initReactiveProperties = (user: IUser) => {
  const newMessagesCount = user.messages.filter((msg: IMessage) => msg.seen === false).length;
  user.newMessagesCount = newMessagesCount;
  user.typing = false;
};

onMounted(() => {
  socket.on('connect', () => {
    userList.value.forEach((user: IUser) => {
      if (user.self) user.connected = true;
    });
  });

  socket.on("disconnect", () => {
    userList.value.forEach((user: IUser) => {
      if (user.self) user.connected = false;
    });
  });

  socket.on("users", (users: IUser[]) => {
    users.forEach((user: IUser) => {
      user.messages.forEach((message: IMessage) => {
        message.fromSelf = message.from === socket.userID;
        message.seen = message.fromSelf ? true : message.seen;
      });

      userList.value.forEach((u: IUser) => {
        if (u.userID === user.userID) {
          u.connected = user.connected;
          u.messages = user.messages;
          return;
        }
      });

      user.self = user.userID === socket.userID;
      initReactiveProperties(user);
      userList.value.push(user);
    })
  });

  socket.on("user-connected", (user: IUser) => {
    for (const u of userList.value) {
      if (u.userID === user.userID) {
        u.connected = true;
        return;
      }
    }

    initReactiveProperties(user);
    userList.value.push(user);
  });

  socket.on("private-message", (message: any) => {
    userList.value.forEach((user: IUser) => {
      if (user.userID === message.from) {
        const isSelected = selectedUser.value ? user.username === selectedUser.value.username : false;
        user.messages.push({ ...message, fromSelf: false });
        isSelected ? socket.emit("seen", selectedUser.value.userID) : user.newMessagesCount++;
      }
    })
  });

  socket.on('typing', (from) => {
    userList.value.forEach((user: IUser) => {
      if (user.userID === from) user.typing = true;
    });
  })

  socket.on('stop-typing', (from) => {
    userList.value.forEach((user: IUser) => {
      if (user.userID === from) user.typing = false;
    });
  }) 
    
  socket.on('seen', (userID) => {
    userList.value.forEach((user: IUser) => {
      if (user.userID === userID) {
        user.messages.forEach(msg => msg.seen = true);
        user.newMessagesCount = 0;
      }
    });
  })

  socket.on("user-disconnected", (id) => {
    userList.value.forEach((user: IUser) => {
      if (user.userID === id) user.connected = false;
    });
  });
});

onUnmounted(() => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("users");
  socket.off("user-connected");
  socket.off("user-disconnected");
  socket.off("private-message");
  socket.off("typing");
  socket.off("stop-typing");
  socket.off("seen");
})
</script>
