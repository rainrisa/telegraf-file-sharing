import "dotenv/config";
import { bool, cleanEnv, num, str } from "envalid";

const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  DB_CHANNEL_ID: num(),
  DEVELOPMENT: bool({ default: undefined }),
  WEBHOOK_DOMAIN: str({ default: undefined }),
  PORT: num({ default: 8080 }),
  FORCE_CHANNEL_IDS: str({ default: undefined }),
  FORCE_GROUP_IDS: str({ default: undefined }),
  ADMIN_IDS: str(),
  DATABASE_URL: str({ default: undefined }),
  NO_FORWARD: bool({ default: undefined }),
  BROADCAST_LOG_DELAY: num({ default: undefined }),
});

export default env;
