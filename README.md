# Telegraf File Sharing

Hi, this is just my personal bot to improve my programming skills

This repository is based on [File Sharing Bot](https://github.com/CodeXBotz/File-Sharing-Bot.git) which created using Pyrogram. But in my repository I choose Telegraf.js. I think it's just easier to find the hosting site if we use a https bot, because we can use webhook

## Features

- Broadcast messages with stats
- Share any kind of messages
- You are free to set as many force sub channels and groups as you want
- Custom force sub urls without requiring the bot to join the specified channels/groups
- Support db (MongoDB) and no db (in memory), just in case you want to quickly share some files without the need of database
- Multiple admins
- Have short urls, for example: `https://t.me/your_bot?start=2781253471`
- Enable/disable forwarding
- Bot stats (total users)

## Notes

Currently it lacks some features like:

- No customisable, currently you are still required to edit the code directly in order to customize
- No auto-delete shared messages

## Usage

- Just import this repository on [Replit](https://replit.com/) or [cyclic](https://cyclic.sh/) and fill out the variables

## Variables

- `TELEGRAM_BOT_TOKEN`, _required_, your bot token from [BotFather](https://t.me/BotFather)
- `DB_CHANNEL_ID`, _required_, a channel where all your files/messages will be stored
- `FORCE_SUB_IDS`, _optional_, all the chat ids you want people to join
- `FORCE_SUB_URLS`, _optional_, custom chat links that don't require the bot to join the group
- `ADMIN_IDS`, _required_, fill least one admin
- `DATABASE_URL`, _optional_, fill this with your MongoDB uri if you want to use a database, if not, all data will stored in RAM
- `DEVELOPMENT`, _optional_, set `true` if you are on local so you don't have to setup a web server. Also set this `true` if you want to use long polling instead of webhook
- `NO_FORWARD`, _optional_, set `true` if you want to disable forwarding
- `BROADCAST_LOG_DELAY`, _optional_, in ms, default to `10000` or 10 seconds

You don't need to set `API_ID` and `API_HASH` because this is not an MTProto bot. You probably want to read [this](https://docs.pyrogram.org/topics/mtproto-vs-botapi) as a reference

## Support

If you have any errors, you can create a [new issue](https://github.com/rainrisa/telegraf-file-sharing/issues) in this repository. I will look into it and see if we can find the solution
