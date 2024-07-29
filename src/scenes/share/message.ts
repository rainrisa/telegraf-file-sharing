import { NarrowedContext, Scenes } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram.js";
import telegram from "../../services/telegram.js";

export default async function messageSceneHandler(
  ctx: NarrowedContext<
    Scenes.SceneContext<Scenes.SceneSessionData>,
    Update.MessageUpdate<Message>
  >,
) {
  const chatId = ctx.chat.id;
  const userMessageId = ctx.message.message_id;

  telegram.addMessage(chatId, userMessageId);
  await telegram.sendWaitingMessage(chatId);
}
