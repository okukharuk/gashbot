import { Context, Telegraf } from "telegraf";
import { getProductsByPlace } from "../../routes";
import { MenuInterface } from "../consts";
import { getInlineKeyboard, getMarkup } from "../utils";
import { onStart } from "./command/start";

export const botCommands = (bot: Telegraf<Context>) => {
    bot.command('start', (ctx) => onStart(ctx))
}