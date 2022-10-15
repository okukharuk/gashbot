import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv"
import { launchDB } from "./database";
import { onStart } from "./controllers/commands/command/start";
import { botActions } from "./controllers/actions";
import { isAdmin } from "./middleware/isAdmin";
import { botCommands } from "./controllers/commands";
import { botAdmin } from "./controllers/admin";

dotenv.config()

export const launchBot = async() => {

    console.log(process.env.ADMIN_ID)

    const bot = new Telegraf<Context>(process.env.BOT_TOKEN || '');

    bot.use(isAdmin());
    botCommands(bot);
    botActions(bot);
    botAdmin(bot);
    
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

}