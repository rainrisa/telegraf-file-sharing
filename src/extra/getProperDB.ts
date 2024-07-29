import inMemory from "../databases/inMemory.js";
import mongoDB from "../databases/mongoDB.js";
import { DatabaseClient } from "../interfaces.js";
import env from "../services/env.js";

export default function getProperDB(): DatabaseClient {
  const databaseUrl = env.DATABASE_URL;

  if (databaseUrl) {
    if (databaseUrl.startsWith("mongodb")) {
      return mongoDB;
    }
  }
  return inMemory;
}
