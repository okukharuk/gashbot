import dotenv from 'dotenv';
import { Context, Telegraf } from 'telegraf';

import { botActions } from './controllers/actions';
import { botAdmin } from './controllers/admin';
import { botCommands } from './controllers/commands';
import { isAdmin } from './middleware/isAdmin';

dotenv.config();

export const launchBot = async () => {
  console.log(process.env.ADMIN_ID);

  const bot = new Telegraf<Context>(process.env.BOT_TOKEN || "");

  bot.use(isAdmin());
  botCommands(bot);
  botActions(bot);
  botAdmin(bot);

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
