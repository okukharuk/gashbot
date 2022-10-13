import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv"
import { launchDB } from "./database";
import { onStart } from "./commands/start";
import { botActions } from "./actions";

dotenv.config()

export interface botDataProps {
    lastMessageID: Record<number, number>,
}

export const launchBot = async() => {

    const bot = new Telegraf<Context>(process.env.BOT_TOKEN || ''); 
    const botData: botDataProps = {
        lastMessageID: {},
    }
    
    bot.command('start' ,async(ctx) => {
        const [key, value] = await onStart(ctx);
        if(key && value)
            botData.lastMessageID[key] = value;
    });
    bot.help((ctx) => ctx.reply('Send me a sticker'));
    bot.on('sticker', (ctx) => ctx.reply('👍'));
    bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    botActions(bot, botData);
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

}