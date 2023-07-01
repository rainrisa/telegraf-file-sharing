import { User } from "telegraf/typings/core/types/typegram.js";

class InMemory {
  messages: Map<number, number[]>;
  users: Map<number, User>;

  constructor() {
    this.messages = new Map();
    this.users = new Map();
  }

  async initialize() {}

  async saveMessages(shareId: number, messageIds: number[]) {
    this.messages.set(shareId, messageIds);
    return shareId;
  }

  async getMessages(shareId: number) {
    return this.messages.get(shareId);
  }

  async saveUser(user: User) {
    this.users.set(user.id, user);
    return user;
  }
}
const inMemory = new InMemory();

export default inMemory;
