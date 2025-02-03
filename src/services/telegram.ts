import { Markup, Scenes, Telegraf, deunionize } from "telegraf";
import env from "./env.js";
import {
  InlineKeyboardMarkup,
  User,
} from "telegraf/typings/core/types/typegram.js";
import filterAsync from "../extra/filterAsync.js";
import mapAsync from "../extra/mapAsync.js";
import splitArray from "../extra/splitArray.js";
import toNumArr from "../extra/toNumArr.js";

class Telegram {
  app: Telegraf<Scenes.SceneContext>;
  messages: Map<number, number[]>;
  waitingMessageId: number;
  waitingMessageTimeout: NodeJS.Timeout;
  firstWaitingMessage: boolean;
  inviteLinks: Map<number, string>;

  constructor() {
    this.app = new Telegraf<Scenes.SceneContext>(env.TELEGRAM_BOT_TOKEN);
    this.messages = new Map();
    this.waitingMessageId = NaN;
    this.waitingMessageTimeout = setTimeout(() => {});
    this.firstWaitingMessage = true;
    this.inviteLinks = new Map();
  }

  async initialize() {
    await this.app.telegram.setMyCommands([
      {
        command: "share",
        description: "create new link",
      },
      {
        command: "broadcast",
        description: "broadcast message to users",
      },

      {
        command: "users",
        description: "get total users",
      },
      {
        command: "uptime",
        description: "check bot alive time",
      },
    ]);
    const forceChatIds = [
      ...toNumArr(env.FORCE_CHANNEL_IDS),
      ...toNumArr(env.FORCE_GROUP_IDS),
    ];

    await mapAsync(
      forceChatIds,
      async (chatId) => await this.getInviteLink(chatId),
    );
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

  async sendForceJoinMessage(
    shareId: number,
    chatId: number,
    user: User,
    chatsUserHasNotJoined: number[],
  ) {
    const text =
      `Hello ${user.first_name}\n` +
      `you must join all the groups/channels below first`;
    const replyMarkup = await this.getForceChatButtons(
      shareId,
      chatsUserHasNotJoined,
    );
    await this.app.telegram.sendMessage(chatId, text, {
      reply_markup: replyMarkup,
    });
  }

  async getForceChatButtons(shareId: number, chatsUserHasNotJoined: number[]) {
    const limitPerRow = 2;

    const rawButtons = await mapAsync(
      chatsUserHasNotJoined,
      async (chatId, index) => {
        const label = `Chat ${index + 1}`;
        const inviteLink = await this.getInviteLink(chatId);

        return Markup.button.url(label, inviteLink);
      },
    );
    const forceChatButtons = splitArray(rawButtons, limitPerRow);

    forceChatButtons.push([
      Markup.button.url(
        "Try again",
        `https://t.me/${this.app.botInfo?.username}?start=${shareId}`,
      ),
    ]);
    return {
      inline_keyboard: forceChatButtons,
    };
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
    messageIds: number[],
  ) {
    const resultIds: number[] = [];

    for (const messageId of messageIds) {
      const result = await this.app.telegram.copyMessage(
        toChatId,
        fromChatId,
        messageId,
        { protect_content: env.NO_FORWARD },
      );
      resultIds.push(result.message_id);
    }
    return resultIds;
  }

  async getChatsUserHasNotJoined(userId: number) {
    const chatIds = [
      ...toNumArr(env.FORCE_GROUP_IDS),
      ...toNumArr(env.FORCE_CHANNEL_IDS),
    ];

    return filterAsync(
      chatIds,
      async (chatId) => !(await this.alreadyJoinChat(chatId, userId)),
    );
  }

  async alreadyJoinChat(chatId: number, userId: number) {
    const { status } = await this.app.telegram.getChatMember(chatId, userId);

    return (
      status === "administrator" ||
      status === "creator" ||
      status === "member" ||
      status === "restricted"
    );
  }

  async getInviteLink(chatId: number) {
    const cachedInviteLink = this.inviteLinks.get(chatId);

    if (cachedInviteLink) {
      return cachedInviteLink;
    }
    const existingInviteLink = deunionize(
      await this.app.telegram.getChat(chatId),
    ).invite_link;

    if (existingInviteLink) {
      this.inviteLinks.set(chatId, existingInviteLink);
      return existingInviteLink;
    }
    const inviteLink = await this.app.telegram.exportChatInviteLink(chatId);
    this.inviteLinks.set(chatId, inviteLink);

    return inviteLink;
  }
}
const telegram = new Telegram();

export default telegram;
