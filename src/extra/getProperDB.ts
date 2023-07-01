import inMemory from "../databases/inMemory.js";
import { DatabaseClient } from "../interfaces.js";

export default function getProperDB(): DatabaseClient {
  return inMemory;
}
