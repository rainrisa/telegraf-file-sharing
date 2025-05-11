import { CommandContext } from "../../interfaces.js";
import globalState from "../../services/globalState.js";
import telegram from "../../services/telegram.js";

export default async function uptimeHandler(ctx: CommandContext) {
  let uptimeTotal = Math.abs(Date.now() - globalState.startTime) / 1000;
  const uptimeHours = Math.floor(uptimeTotal / 3600);
  uptimeTotal -= uptimeHours * 3600;
  const uptimeMinutes = Math.floor(uptimeTotal / 60) % 60;
  uptimeTotal -= uptimeMinutes * 60;
  const uptimeSeconds = (uptimeTotal % 60).toFixed();

  let uptimeMessage = "";

  if (uptimeHours !== 0 && uptimeMinutes !== 0) {
    uptimeMessage = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;
  } else if (uptimeHours === 0 && uptimeMinutes !== 0) {
    uptimeMessage = `${uptimeMinutes}m ${uptimeSeconds}s`;
  } else {
    uptimeMessage = `${uptimeSeconds}s`;
  }
  return telegram.sendMessage(ctx.chat.id, uptimeMessage);
}
