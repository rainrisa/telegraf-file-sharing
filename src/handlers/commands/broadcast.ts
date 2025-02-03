import { CommandContext } from "../../interfaces.js";
import auth from "../../services/auth.js";
import { Broadcast } from "../../services/broadcast.js";
import database from "../../services/database.js";
import env from "../../services/env.js";
import telegram from "../../services/telegram.js";

export default async function broadcastHandler(ctx: CommandContext) {
  const userId = ctx.from.id;

  if (!auth.isAdmin(userId)) {
    return ctx.reply("Sorry, you have no permission to do this");
  }
  const messageToBroadcast = ctx.message.reply_to_message;

  if (!messageToBroadcast) {
    return ctx.reply("Reply to the message you want to broadcast");
  }
  const totalUsers = await database.getTotalUsers();
  const chatId = ctx.chat.id;
  const sendLogDelay = env.BROADCAST_LOG_DELAY || 10000;
  const broadcast = new Broadcast(telegram.app);
  const m = await ctx.reply(
    `Broadcasting message to ${totalUsers} user\n` +
      `This will take some time..`,
  );
  const sendLog = async () => {
    await ctx.telegram.editMessageText(
      chatId,
      m.message_id,
      undefined,
      broadcast.getStats(),
      {
        parse_mode: "MarkdownV2",
      },
    );
  };
  const logInterval = setInterval(sendLog, sendLogDelay);
  await broadcast.broadcastMessage(messageToBroadcast.message_id, userId);

  clearInterval(logInterval);
  await sendLog();
}
