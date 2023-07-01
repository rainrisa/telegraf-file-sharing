class InMemory {
  collection: Map<number, number[]>;

  constructor() {
    this.collection = new Map();
  }

  async initialize() {}

  async saveMessages(shareId: number, messageIds: number[]) {
    this.collection.set(shareId, messageIds);
    return shareId;
  }

  async getMessages(shareId: number) {
    return this.collection.get(shareId);
  }
}
const inMemory = new InMemory();

export default inMemory;
