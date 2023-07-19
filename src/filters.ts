import { Context } from "telegraf";

export default {
  private(ctx: Context, next: () => void) {
    if (ctx.chat?.type === "private") {
      next();
    }
  },
};
