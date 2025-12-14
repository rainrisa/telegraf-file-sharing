import { User } from "telegraf/typings/core/types/typegram.js";
import env from "../services/env.js";
import { IRepository } from "../databases/adapter.js";
import mongoRepository from "../databases/mongoDB.js";
import inMemoryRepository from "../databases/inMemory.js";

export default function getProperDB(): IRepository<User> {
  const databaseUrl = env.DATABASE_URL;

  if (databaseUrl?.startsWith("mongodb")) {
    return mongoRepository;
  }

  return inMemoryRepository;
}
