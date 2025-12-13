import "dotenv/config";
import { bool, cleanEnv, makeValidator, num, str } from "envalid";
import toNumArr from "../extra/toNumArr.js";

const numArr = makeValidator<number[]>((input: string) => {
  const coerced = input.split(" ").map(Number);
  return coerced;
});
const strArr = makeValidator<string[]>((input: string) => {
  const coerced = input.split(" ");
  return coerced;
});
const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  DB_CHANNEL_ID: num(),
  DEVELOPMENT: bool({ default: undefined }),
  WEBHOOK_DOMAIN: str({ default: undefined }),
  PORT: num({ default: 8080 }),
  FORCE_SUB_IDS: numArr({ default: [] }),
  FORCE_SUB_URLS: strArr({ default: [] }),
  ADMIN_IDS: str(),
  DATABASE_URL: str({ default: undefined }),
  NO_FORWARD: bool({ default: undefined }),
  BROADCAST_LOG_DELAY: num({ default: undefined }),
});
env.FORCE_SUB_IDS.push(...toNumArr(process.env.FORCE_GROUP_IDS));
env.FORCE_SUB_IDS.push(...toNumArr(process.env.FORCE_CHANNEL_IDS));

export default env;
