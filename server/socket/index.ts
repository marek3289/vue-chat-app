import { Server } from "socket.io";
import { userStore, messageStore } from '../server';
import { ISocket, IUser } from '../utils/types';
import createError from 'http-errors';

import { getRandomId } from '../utils/helpers';

export default (io: Server) => {
  io.use((socket: ISocket, next) => {
    const { userID } = socket.handshake.auth;
    const loggedUser = userStore.findUser(userID);
    
    if (userID && loggedUser) {
      socket.userID = userID;
      socket.username = loggedUser.username;
      return next();
    }
    
    return next(createError(500, `Error`));
  });

  
  io.on("connection", (socket: ISocket) => {
    socket.join(socket.userID);
    userStore.saveUser(socket.userID, { connected: true });

    const userList: IUser[] = [];
    const messagesPerUser = new Map();

    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    userStore.findAllUsers().forEach(user => {
      const messageHistory = messagesPerUser.get(user.userID);
      userList.push({ userID: user.userID, username: user.username, avatar: user.avatar, connected: user.connected, messages: messageHistory || [] });
    });

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      username: socket.username,
      avatar: 'default-avatar',
      connected: true,
      messages: [],
    });
    
    socket.emit("users", userList);

    socket.on("private-message", ({ timestamp, message, to }) => {
      const newMessage = { id: getRandomId(), seen: false, timestamp, from: socket.userID, message, to };
      socket.to(to).to(socket.userID).emit("private-message", newMessage);
      messageStore.createMessage(newMessage);
    });

    let timer: NodeJS.Timeout;
    socket.on('typing', (to) => {
      socket.to(to).emit("typing", socket.userID);
      
      clearTimeout(timer);
      timer = setTimeout(() => socket.to(to).emit("stop-typing", socket.userID), 3000);
    })

    socket.on('stop-typing', (to) => {
      clearTimeout(timer);
      socket.to(to).emit("stop-typing", socket.userID);
    })

    socket.on('seen', (userID) => {
      messageStore.findMessagesInConversation(userID, socket.userID).forEach((msg: any) => {
        if (msg.from === userID) {
          msg.seen = true;
        }
        messageStore.saveMessage(msg.id, { ...msg });
      });

      socket.emit("seen", userID);
    })

    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;

      if (isDisconnected) {
        socket.broadcast.emit("user-disconnected", socket.userID);
        userStore.saveUser(socket.userID, { connected: false });
      }
    })
  })
  
  return io;
};
