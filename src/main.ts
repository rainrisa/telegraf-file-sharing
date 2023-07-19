import express from "express";
import env from "./services/env.js";
import telegram from "./services/telegram.js";
import commands from "./handlers/commands/index.js";
import stage from "./scenes/index.js";
import { session } from "telegraf";
import database from "./services/database.js";
import filters from "./filters.js";

const app = telegram.app;

app.use(session());
app.use(stage.middleware());
app.use(filters.private);

app.command("start", commands.startHandler);
app.command("share", commands.shareHandler);
app.command("uptime", commands.uptimeHandler);

async function main() {
  await database.initialize();
  await telegram.initialize();

  if (env.development) {
    app.launch();
  } else {
    const domain = env.webhookDomain;

    if (!domain) {
      throw Error("Please provide WEBHOOK_DOMAIN");
    }
    const server = express();
    const port = env.port;

    server.use(await app.createWebhook({ domain }));
    server.listen(port, () => console.log(`Server listening on ${port}`));
  }
}
main();

process.once("SIGINT", () => app.stop("SIGINT"));
process.once("SIGTERM", () => app.stop("SIGTERM"));
