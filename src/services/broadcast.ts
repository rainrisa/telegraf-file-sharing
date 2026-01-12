import { Scenes, Telegraf, TelegramError } from "telegraf";
import database from "./database.js";
import sleep from "../extra/sleep.js";
import { format } from "date-fns";

export class Broadcast {
  bot: Telegraf<Scenes.SceneContext>;
  success: number;
  deactivated: number;
  blocked: number;
  otherErrors: number;
  totalSent: number;
  totalUsers: number;
  done: boolean;
  startTime: number = 0;
  endTime: number = 0;

  constructor(bot: Telegraf<Scenes.SceneContext>) {
    this.bot = bot;
    this.success = 0;
    this.deactivated = 0;
    this.blocked = 0;
    this.otherErrors = 0;
    this.totalSent = 0;
    this.totalUsers = 0;
    this.done = false;
  }

  private formatDuration(ms: number) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
  }

  getStats() {
    const lastUpdated = format(new Date(), "HH:mm:ss");
    const broadcastTitle = this.done
      ? "BROADCAST DONE"
      : "BROADCAST IN PROGRESS";
    const code = (x: string | number) => "`" + x + "`";

    const elapsed =
      this.startTime === 0
        ? 0
        : this.done
          ? this.endTime - this.startTime
          : Date.now() - this.startTime;

    return (
      broadcastTitle +
      "\n\n" +
      "Success: " +
      code(this.success) +
      "\nDeactivated: " +
      code(this.deactivated) +
      "\nBlocked: " +
      code(this.blocked) +
      "\nOther Errors: " +
      code(this.otherErrors) +
      `\n\nBroadcasted to ${code(
        this.totalSent + "/" + this.totalUsers,
      )} users` +
      "\nTime taken: " +
      code(this.formatDuration(elapsed)) +
      "\nLast Updated: " +
      code(lastUpdated)
    );
  }

  async sendBroadcast(
    chat: string | number,
    fromChat: string | number,
    messageId: number,
  ) {
    try {
      await this.bot.telegram.copyMessage(chat, fromChat, messageId);
      this.success++;
    } catch (err) {
      if (err instanceof TelegramError) {
        const desc = err.response.description;

        if (desc === "Forbidden: user is deactivated") {
          this.deactivated++;
          return; // Exit early, but `finally` will still run
        } else if (desc === "Forbidden: bot was blocked by the user") {
          this.blocked++;
          return; // Exit early, but `finally` will still run
        }
      }
      console.log((err as Error).message);
      this.otherErrors++;
    } finally {
      this.totalSent++;
    }
  }

  async broadcastMessage(messageId: number, fromChat: string | number) {
    this.startTime = Date.now();
    // https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once
    let broadcastPerSecond = 30;
    const broadcasts = [];
    this.totalUsers = await database.getTotalUsers();

    for await (const user of database.getAllUsers()) {
      broadcasts.push(this.sendBroadcast(user.id, fromChat, messageId));

      if (broadcasts.length > broadcastPerSecond) {
        await Promise.all(broadcasts);
        broadcasts.length = 0;
        await sleep(1000);
      }
    }
    await Promise.all(broadcasts);
    this.done = true;
    this.endTime = Date.now();
  }
}
