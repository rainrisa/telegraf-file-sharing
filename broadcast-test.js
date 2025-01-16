import database from "./dist/services/database.js";
import telegram from "./dist/services/telegram.js";

console.log("connecting");
await database.initialize();
console.log("starting");

const msgId = 3;
const fromChatId = -1;

await telegram.broadcastMessage(
  msgId,
  fromChatId,
);
