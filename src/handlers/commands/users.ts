import { CommandContext } from "../../interfaces.js";
import database from "../../services/database.js";

export default async function usersHandler(ctx: CommandContext) {
  const totalUsers = await database.getTotalUsers();
  return ctx.reply(`${totalUsers} users`);
}
