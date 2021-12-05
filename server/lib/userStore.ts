// abstract class
class UserStore {
  findUser(id: string) {}
  saveUser(id: string, user: any) {}
  findAllUsers() {}
}

class InMemoryUserStore extends UserStore {
  users: Map<any, any>;

  constructor() {
    super();
    this.users = new Map();
  }

  findUser(id: string) {
    return this.users.get(id);
  }

  saveUser(id: any, user: any) {
    const oldData = this.users.get(id);
    this.users.set(id, { ...oldData, ...user });
  }

  findAllUsers() {
    return [...this.users.values()];
  }
}

export default InMemoryUserStore;
