/* abstract */    
class MessageStore {
  createMessage(message: any) {}
  saveMessage(msgId: any, message: any) {}
  findMessagesForUser(userID: any) {}
  findMessagesInConversation(fromUserId: any, toUserId: any) {}
}

class InMemoryMessageStore extends MessageStore {
  messages: any[];

  constructor() {
    super();
    this.messages = [];
  }
  
  createMessage(message: any) {
    this.messages.push(message);
  }

  saveMessage(msgId: any, message: any) {
    const newMessages = this.messages.filter(msg => msg.id !== msgId);
    this.messages = [...newMessages, message];
  }

  findMessagesForUser(userID: any) {
    return this.messages.filter(({ from, to }) => from === userID || to === userID);
  }

  findMessagesInConversation(fromUserId: any, toUserId: any) {
    return this.messages.filter(({ from, to }) => (from === fromUserId && to === toUserId) || (from === toUserId && to === fromUserId));
  }
}

export default InMemoryMessageStore;