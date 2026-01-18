import { DatabaseFactory } from "../databases/DatabaseFactory.js";

const databaseFactory = new DatabaseFactory();
const database = databaseFactory.createDatabase();

export default database;
