import { InMemory } from "./inMemory.js";
import { MongoDB } from "./mongoDB.js";
import { DatabaseStrategy } from "../interfaces.js";
import env from "../services/env.js";

export class DatabaseFactory {
  createDatabase(): DatabaseStrategy {
    const databaseUrl = env.DATABASE_URL;

    if (databaseUrl && databaseUrl.startsWith("mongodb")) {
      return new MongoDB(databaseUrl);
    }

    return new InMemory();
  }
}
