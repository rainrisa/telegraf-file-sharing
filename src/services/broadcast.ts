import { Scenes, Telegraf, TelegramError } from "telegraf";
import { BroadcastStatus as Status } from "../interfaces.js";
import database from "./database.js";
import { User } from "telegraf/typings/core/types/typegram.js";
import sleep from "../extra/sleep.js";

export class Broadcast {
  bot: Telegraf<Scenes.SceneContext>;
  success: number;
  deactivated: number;
  blocked: number;
  otherErrors: number;

  constructor(bot: Telegraf<Scenes.SceneContext>) {
    this.bot = bot;
    this.success = 0;
    this.deactivated = 0;
    this.blocked = 0;
    this.otherErrors = 0;
  }

  getResult() {
    return {
      success: this.success,
      deactivated: this.deactivated,
      blocked: this.blocked,
      otherErrors: this.otherErrors,
    };
  }

  async sendBroadcast(
    chat: string | number,
    fromChat: string | number,
    messageId: number,
  ) {
    try {
      await this.bot.telegram.copyMessage(chat, fromChat, messageId);
      this.success++;
      return Status.SUCCESS;
    } catch (err) {
      if (err instanceof TelegramError) {
        const desc = err.response.description;

        if (desc === "Forbidden: user is deactivated") {
          this.deactivated++;
          return Status.DEACTIVATED;
        } else if (desc === "Forbidden: bot was blocked by the user") {
          this.blocked++;
          return Status.BLOCKED;
        }
      }
      console.log((err as Error).message);
      this.otherErrors++;
      return Status.OTHER_ERRORS;
    }
  }

  async broadcastMessage(messageId: number, fromChat: string | number) {
    // https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once
    let broadcastPerSecond = 30;
    const broadcasts = [];

    for await (const user of database.getAllUsers()) {
      console.log(user.first_name);
      broadcasts.push(this.sendBroadcast(user.id, fromChat, messageId));

      if (broadcasts.length > broadcastPerSecond) {
        await Promise.all(broadcasts);
        console.log(this.getResult());
        broadcasts.length = 0;
        await sleep(1000);
      }
    }
    console.log("LAST!!");
    await Promise.all(broadcasts);
    console.log(this.getResult());
    console.log("DONE!!");
  }
}
