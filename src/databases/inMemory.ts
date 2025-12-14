import { User } from "telegraf/typings/core/types/typegram.js";
import { IRepository } from "./adapter";
import { MessageEntity } from "./types";

class InMemoryRepository implements IRepository<User> {
  private messages = new Map<number, MessageEntity>();
  private users = new Map<number, User>();

  async initialize() {}

  async saveMessages(message: MessageEntity) {
    this.messages.set(message.shareId, message);
    return message.shareId;
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
    for (const user of this.users.values()) {
      yield user;
    }
  }
}

const inMemoryRepository = new InMemoryRepository();

export default inMemoryRepository;
