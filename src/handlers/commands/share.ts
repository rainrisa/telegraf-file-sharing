import { CommandContext } from "../../interfaces.js";
import auth from "../../services/auth.js";
import telegram from "../../services/telegram.js";

export default async function shareHandler(ctx: CommandContext) {
  const userId = ctx.from.id;

  if (!auth.isAdmin(userId)) {
    return telegram.sendMessage(
      userId,
      "Sorry, you have no permission to do this",
    );
  }
  await ctx.scene.enter("share");
}
