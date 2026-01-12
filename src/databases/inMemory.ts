import { User } from "telegraf/typings/core/types/typegram.js";

import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.resolve("data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

class InMemory {
  messages: Map<number, number[]>;
  users: Map<number, User>;

  constructor() {
    this.messages = new Map();
    this.users = new Map();
  }

  async initialize() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {
      console.error("Failed to create data directory:", err);
    }

    try {
      const messagesData = await fs.readFile(MESSAGES_FILE, "utf-8");
      const messagesObj = JSON.parse(messagesData);
      for (const [key, value] of Object.entries(messagesObj)) {
        this.messages.set(Number(key), value as number[]);
      }
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error reading messages file:", error);
      }
    }

    try {
      const usersData = await fs.readFile(USERS_FILE, "utf-8");
      const usersObj = JSON.parse(usersData);
      for (const [key, value] of Object.entries(usersObj)) {
        this.users.set(Number(key), value as User);
      }
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error reading users file:", error);
      }
    }
  }

  private async persistMessages() {
    const obj = Object.fromEntries(this.messages);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(obj, null, 2));
  }

  private async persistUsers() {
    const obj = Object.fromEntries(this.users);
    await fs.writeFile(USERS_FILE, JSON.stringify(obj, null, 2));
  }

  async saveMessages(shareId: number, messageIds: number[]) {
    this.messages.set(shareId, messageIds);
    await this.persistMessages();
    return shareId;
  }

  async getMessages(shareId: number) {
    return this.messages.get(shareId);
  }

  async saveUser(user: User) {
    this.users.set(user.id, user);
    await this.persistUsers();
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
const inMemory = new InMemory();

export default inMemory;
