import getRandomId from "../extra/getRandomId.js";

class Database {
  collection: Map<number, number[]>;

  constructor() {
    this.collection = new Map();
  }

  saveMessages(messageIds: number[]) {
    const shareId = getRandomId();
    this.collection.set(shareId, messageIds);

    return shareId;
  }
}
const database = new Database();

export default database;
