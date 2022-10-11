import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv"
import { launchDB } from "./database";
import { onStart } from "./commands/start";

dotenv.config()

export const launchBot = async() => {

    const bot = new Telegraf<Context>(process.env.BOT_TOKEN || '');
    
    bot.start(async(ctx) => {
        await onStart(ctx);
    });
    bot.help((ctx) => ctx.reply('Send me a sticker'));
    bot.on('sticker', (ctx) => ctx.reply('👍'));
    bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

}