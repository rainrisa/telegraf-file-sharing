import { CommandContext } from "../../interfaces.js";

export default async function shareHandler(ctx: CommandContext) {
  await ctx.scene.enter("share");
}
