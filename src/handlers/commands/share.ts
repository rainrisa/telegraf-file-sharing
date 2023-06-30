import { CommandContext } from "../../interfaces.js";
import auth from "../../services/auth.js";

export default async function shareHandler(ctx: CommandContext) {
  const userId = ctx.from.id;

  if (!auth.isAdmin(userId)) {
    return ctx.reply("Sorry, you have no permission to do this");
  }
  await ctx.scene.enter("share");
}
