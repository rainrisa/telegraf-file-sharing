import { CommandContext } from "../../interfaces.js";
import auth from "../../services/auth.js";
import database from "../../services/database.js";
import telegram from "../../services/telegram.js";

export default async function broadcastHandler(ctx: CommandContext) {
  const userId = ctx.from.id;

  if (!auth.isAdmin(userId)) {
    return ctx.reply("Sorry, you have no permission to do this");
  }
  const messageToBroadcast = ctx.message.reply_to_message;

  if (!messageToBroadcast) {
    return ctx.reply("Reply to any message you want to broadcast");
  }
  // const userIds = await database.
  const userIds = [1, 2, 3];
  const totalUsers = userIds.length;
  const waitingMessage = await ctx.reply(
    `Broadcasting message to ${totalUsers} user\n` + `This will take some time`
  );
  await telegram.broadcastMessage(
    messageToBroadcast,
    userId,
    userIds,
    waitingMessage.message_id
  );
}