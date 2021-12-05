import { onMounted, onUnmounted } from 'vue';
import { getCurrentUser } from '@/services/auth';
import store from '@/store';
import socket from '@/socket';
import { AuthTypes } from '@/utils/types';

export default () => {
  onMounted(() => {
    const { user } = getCurrentUser();
    const { username, userID } = user;
    
    socket.userID = userID;
    socket.username = username;

    socket.auth = { userID };
    socket.connect();

    socket.on("connect_error", () => store.dispatch(AuthTypes.LOGOUT));
  })

  onUnmounted(() => {
    socket.off("connect_error");
  })
}
