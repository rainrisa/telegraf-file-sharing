import inMemory from "./inMemory.js";
import mongoDB from "./mongoDB.js";
import { DatabaseStrategy } from "../interfaces.js";
import env from "../services/env.js";

export class DatabaseFactory {
  createDatabase(): DatabaseStrategy {
    const databaseUrl = env.DATABASE_URL;

    if (databaseUrl && databaseUrl.startsWith("mongodb")) {
      return mongoDB;
    }

    return inMemory;
  }
}
