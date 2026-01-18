import { DatabaseFactory } from "../databases/databaseFactory.js";

const databaseFactory = new DatabaseFactory();
const database = databaseFactory.createDatabase();

export default database;
