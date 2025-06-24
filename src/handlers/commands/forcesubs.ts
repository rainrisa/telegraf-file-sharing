import { CommandContext } from "../../interfaces.js";
import env from "../../services/env.js";
import telegram from "../../services/telegram.js";

export default async function forcesubsHandler(ctx: CommandContext) {
  const mockShareId = 123;
  const chatId = ctx.chat.id;
  const user = ctx.from;
  const chatsUserHasNotJoined = env.FORCE_SUB_IDS;

  return telegram.sendForceJoinMessage(
    mockShareId,
    chatId,
    user,
    chatsUserHasNotJoined,
  );
}
