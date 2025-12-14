import { User } from "telegraf/typings/core/types/typegram.js";
import getProperDB from "../extra/getProperDB.js";
import getRandomId from "../extra/getRandomId.js";
import { IRepository } from "../databases/adapter.js";
import { MessageEntity } from "../databases/types.js";

class Database {
  private client: IRepository<User>;

  constructor() {
    this.client = getProperDB();
  }

  async initialize() {
    await this.client.initialize();
  }

  async saveMessages(messageIds: number[], direct = false) {
    const message: MessageEntity = {
      shareId: getRandomId(),
      messageIds,
      direct,
    };

    await this.client.saveMessages(message);
    return message.shareId;
  }

  async getMessages(shareId: number) {
    return this.client.getMessages(shareId);
  }

  async saveUser(user: User) {
    return this.client.saveUser(user);
  }

  async getTotalUsers() {
    return this.client.getTotalUsers();
  }

  async *getAllUsers() {
    for await (const user of this.client.getAllUsers()) {
      yield user;
    }
  }
}
const database = new Database();

export default database;
