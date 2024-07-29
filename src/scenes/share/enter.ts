import { Scenes } from "telegraf";
import telegram from "../../services/telegram.js";

export default async function enterSceneHandler(
  ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
) {
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  await telegram.sendWaitingMessage(chatId);
}
