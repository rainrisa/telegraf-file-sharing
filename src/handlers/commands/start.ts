import { CommandContext } from "../../interfaces.js";
import auth from "../../services/auth.js";
import database from "../../services/database.js";
import env from "../../services/env.js";
import telegram from "../../services/telegram.js";

export default async function startHandler(ctx: CommandContext) {
  const chatId = ctx.chat.id;
  const shareId = Number(ctx.message.text.split(" ")[1]) || undefined;
  const user = ctx.from;
  const userId = user.id;

  try {
    await database.saveUser(user);
  } catch {}

  if (!shareId) {
    return telegram.sendMessage(chatId, `Hello ${user.first_name}!`);
  }
  if (!auth.isAdmin(userId)) {
    const chatsUserHasNotJoined =
      await telegram.getChatsUserHasNotJoined(userId);
    if (chatsUserHasNotJoined.length) {
      return telegram.sendForceJoinMessage(
        shareId,
        chatId,
        user,
        chatsUserHasNotJoined,
      );
    }
  }
  const messages = await database.getMessages(Number(shareId));

  if (!messages) {
    return telegram.sendMessage(chatId, "Message not found, try another link");
  }
  await telegram.forwardMessages(
    chatId,
    env.DB_CHANNEL_ID,
    messages.messageIds,
  );
}
