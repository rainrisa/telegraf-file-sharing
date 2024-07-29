import { NarrowedContext, Scenes } from "telegraf";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram.js";
import { callbackQuery } from "telegraf/filters";
import telegram from "../../services/telegram.js";
import env from "../../services/env.js";
import database from "../../services/database.js";

export default async function callbackQuerySceneHandler(
  ctx: NarrowedContext<
    Scenes.SceneContext<Scenes.SceneSessionData>,
    Update.CallbackQueryUpdate<CallbackQuery>
  >,
) {
  const chatId = ctx.chat?.id;

  if (!chatId) return;
  if (!ctx.has(callbackQuery("data"))) return;

  const data = ctx.callbackQuery.data;

  if (data === "share-finish") {
    const messageIds = telegram.messages.get(chatId);

    telegram.clearMessages(chatId);
    await ctx.scene.leave();

    if (!messageIds) {
      return ctx.editMessageText("You are not sending any message");
    }
    const forwardedMessageIds = await telegram.forwardMessages(
      env.DB_CHANNEL_ID,
      chatId,
      messageIds,
    );
    const botUsername = ctx.botInfo.username;
    const shareId = await database.saveMessages(forwardedMessageIds);

    await ctx.editMessageText("Okay");
    await ctx.reply(`https://t.me/${botUsername}?start=${shareId}`);
  }
}
