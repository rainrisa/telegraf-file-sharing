import { User } from "telegraf/typings/core/types/typegram.js";
import { DatabaseStrategy } from "../interfaces.js";

export class InMemory implements DatabaseStrategy {
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

  async getTotalUsers() {
    return this.users.size;
  }

  async *getAllUsers() {
    for (const [id, user] of this.users) {
      yield user;
    }
  }
}
