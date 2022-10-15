import { Context, Telegraf } from "telegraf";
import { onStart } from "./command/start";

export const botCommands = (bot: Telegraf<Context>) => {
    bot.command('start', (ctx) => onStart(ctx))
}