import { Scenes, Telegraf } from "telegraf";
import env from "./env.js";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram.js";

class Telegram {
  app: Telegraf<Scenes.SceneContext>;
  messages: Map<number, number[]>;
  waitingMessageId: number;
  waitingMessageTimeout: NodeJS.Timeout;
  firstWaitingMessage: boolean;

  constructor() {
    this.app = new Telegraf<Scenes.SceneContext>(env.token);
    this.messages = new Map();
    this.waitingMessageId = NaN;
    this.waitingMessageTimeout = setTimeout(() => {});
    this.firstWaitingMessage = true;
  }

  async initialize() {
    await this.app.telegram.setMyCommands([
      {
        command: "share",
        description: "create new link",
      },
    ]);
  }

  async sendWaitingMessage(chatId: number) {
    clearTimeout(this.waitingMessageTimeout);

    const totalMessages = this.messages.get(chatId)?.length || 0;
    const text =
      "Send me any message and click Finish when you are done!\n" +
      `Total messages: ${totalMessages}`;
    const replyMarkup: InlineKeyboardMarkup = {
      inline_keyboard: [[{ text: "Finish", callback_data: "share-finish" }]],
    };
    const delay = this.firstWaitingMessage ? 0 : 1000;
    this.waitingMessageTimeout = setTimeout(async () => {
      try {
        await this.deleteWaitingMessage(chatId);
      } catch {}

      const waitingMessage = await this.app.telegram.sendMessage(chatId, text, {
        reply_markup: replyMarkup,
      });
      this.waitingMessageId = waitingMessage.message_id;
      this.firstWaitingMessage = false;
    }, delay);
  }

  async deleteWaitingMessage(chatId: number) {
    await this.app.telegram.deleteMessage(chatId, this.waitingMessageId);
  }

  addMessage(chatId: number, messageId: number) {
    const messages = this.messages.get(chatId) || [];
    messages.push(messageId);
    this.messages.set(chatId, messages);
  }

  clearMessages(chatId: number) {
    this.messages.delete(chatId);
    this.firstWaitingMessage = true;
    this.waitingMessageId = NaN;
  }

  async forwardMessages(
    toChatId: number,
    fromChatId: number,
    messageIds: number[]
  ) {
    const resultIds: number[] = [];

    for (const messageId of messageIds) {
      const result = await this.app.telegram.copyMessage(
        toChatId,
        fromChatId,
        messageId
      );
      resultIds.push(result.message_id);
    }
    return resultIds;
  }
}
const telegram = new Telegram();

export default telegram;
