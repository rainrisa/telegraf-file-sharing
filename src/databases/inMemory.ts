import { User } from "telegraf/typings/core/types/typegram.js";
import { GetAllUsersOptions } from "../interfaces";

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

  async getTotalUsers() {
    return this.users.size;
  }

  async *getAllUsers(options?: GetAllUsersOptions) {
    const offset = options?.offset || 0;
    const limit = options?.limit || Infinity;

    let skipped = 0;
    let yielded = 0;

    for (const user of this.users.values()) {
      if (skipped < offset) {
        skipped++;
        continue;
      }
      if (yielded >= limit) break;

      yielded++;
      yield user;
    }
  }
}
const inMemory = new InMemory();

export default inMemory;
