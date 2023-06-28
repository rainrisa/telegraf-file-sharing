import { CommandContext } from "../../interfaces.js";
import database from "../../services/database.js";
import env from "../../services/env.js";
import telegram from "../../services/telegram.js";

export default async function startHandler(ctx: CommandContext) {
  const chatId = ctx.chat.id;
  const shareId = ctx.message.text.split(" ")[1] || undefined;
  const messageIds = database.getMessages(Number(shareId));

  if (!shareId) {
    return ctx.reply(`Hello ${ctx.from.first_name}!`);
  }
  if (!messageIds) {
    return ctx.reply("Message not found, try another link");
  }
  await telegram.forwardMessages(chatId, env.dbChannelId, messageIds);
}
