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

  getMessages(shareId: number) {
    return this.client.getMessages(shareId);
  }
}
const database = new Database();

export default database;
