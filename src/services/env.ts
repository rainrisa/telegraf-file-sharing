import "dotenv/config";

const env = process.env;
const token = env.TELEGRAM_BOT_TOKEN;
const dbChannelId = Number(env.DB_CHANNEL_ID);
const development = env.DEVELOPMENT;
const webhookDomain = env.WEBHOOK_DOMAIN;
const port = env.PORT || 8080;

if (!token) {
  throw Error("Provide TELEGRAM_BOT_TOKEN");
}
if (!dbChannelId) {
  throw Error("Provide DB_CHANNEL_ID");
}
export default { token, dbChannelId, development, webhookDomain, port };
