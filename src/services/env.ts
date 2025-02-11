import "dotenv/config";
import { bool, cleanEnv, makeValidator, num, str } from "envalid";

const numArr = makeValidator<number[]>((input: string) => {
  const coerced = input.split(" ").map(Number);
  return coerced;
});
const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  DB_CHANNEL_ID: num(),
  DEVELOPMENT: bool({ default: undefined }),
  WEBHOOK_DOMAIN: str({ default: undefined }),
  PORT: num({ default: 8080 }),
  FORCE_CHANNEL_IDS: numArr({ default: undefined }),
  FORCE_GROUP_IDS: numArr({ default: undefined }),
  FORCE_SUB_IDS: numArr({ default: [] }),
  ADMIN_IDS: str(),
  DATABASE_URL: str({ default: undefined }),
  NO_FORWARD: bool({ default: undefined }),
  BROADCAST_LOG_DELAY: num({ default: undefined }),
});
env.FORCE_SUB_IDS.push(...(env.FORCE_GROUP_IDS || []));
env.FORCE_SUB_IDS.push(...(env.FORCE_CHANNEL_IDS || []));

export default env;
