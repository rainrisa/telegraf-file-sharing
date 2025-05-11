import { CommandContext } from "../../interfaces.js";
import database from "../../services/database.js";
import telegram from "../../services/telegram.js";

export default async function usersHandler(ctx: CommandContext) {
  const totalUsers = await database.getTotalUsers();
  return telegram.sendMessage(ctx.chat.id, `${totalUsers} users`);
}
