import { Context, deunionize } from "telegraf";

export default function logging(ctx: Context, next: () => void) {
  const text = ctx.message && deunionize(ctx.message).text;
  if (text) {
    const user = ctx.message.from;
    console.log(new Date(), user.id, user.first_name, text);
  }
  next();
}
