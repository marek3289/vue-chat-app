import { io, Socket } from "socket.io-client";

interface ISocket extends Socket {
  username?: string;
  userID?: string
}

const URL = "http://localhost:5000";
const socket: ISocket = io(URL, { autoConnect: false, transports: ['websocket'] });

if (!import.meta.env.PROD) {
  socket.onAny((event, ...args) => console.log('Socket Instance:', event, args));
}

export default socket;
