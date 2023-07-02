# Telegraf File Sharing

Hi, this is just my personal bot to improve my programming skills

This repository is based on [File Sharing Bot](https://github.com/CodeXBotz/File-Sharing-Bot.git) which created using Pyrogram. But in my repository I choose Telegraf.js. I think it's just easier to find the hosting site if we use a https bot, because we can use webhook

## Features

- Share any kind of messages
- You are free to set as many force channels and groups as you want
- Support db (MongoDB) and no db (in memory), just in case you want to quickly share some files without the need of database
- Multiple admins
- Have short urls, for example: `https://t.me/your_bot?start=2781253471`

## Notes

Currently it lacks some features like:

- Broadcast, I haven't tried to broadcast yet so I still have to find out what type of errors might be triggered. Because unlike Pyrogram, Telegraf doesn't have any custom error types
- Redis, i don't know, maybe some people just prefer using this one instead of MongoDB
- No customisable, currently you are still required to edit the code directly in order to customize
- No protected content, maybe in version 2 i will implement this
- No bot stats, but you can still look directly all the users that has started your bot on your database, if you use one

## Usage

- Just import this repository on [Replit](https://replit.com/) or [cyclic](https://cyclic.sh/) and fill out the variables

## Variables

- `TELEGRAM_BOT_TOKEN`, _required_, your bot token from [BotFather](https://t.me/BotFather)
- `DB_CHANNEL_ID`, _required_, a channel where all your files/messages will be stored
- `FORCE_CHANNEL_IDS`, _optional_, all channel ids you want people to join
- `FORCE_GROUP_IDS`, _optional_, all group ids you want people to join
- `ADMIN_IDS`, _required_, fill least one admin
- `DATABASE_URL`, _optional_, fill this with your MongoDB uri if you want to use a database, if not, all data will stored in RAM
- `DEVELOPMENT`, _optional_, set `true` if you are on local so you don't have to setup a web server. Also set this `true` if you want to use long polling instead of webhook

You don't need to set `API_ID` and `API_HASH` because this is not an MTProto bot. You probably want to read [this](https://docs.pyrogram.org/topics/mtproto-vs-botapi) as a reference

## Support

If you have any errors, you can create a [new issue](https://github.com/rainrisa/telegraf-file-sharing/issues) in this repository. I will look into it and see if we can find the solution
