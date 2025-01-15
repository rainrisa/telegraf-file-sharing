import { User } from "telegraf/typings/core/types/typegram.js";
import getProperDB from "../extra/getProperDB.js";
import getRandomId from "../extra/getRandomId.js";
import { DatabaseClient } from "../interfaces.js";

class Database {
  client: DatabaseClient;

  constructor() {
    this.client = getProperDB();
  }

  async initialize() {
    await this.client.initialize();
  }

  async saveMessages(messageIds: number[]) {
    const shareId = getRandomId();
    await this.client.saveMessages(shareId, messageIds);

    return shareId;
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
}
const database = new Database();

export default database;
