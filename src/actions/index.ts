import { Context, Markup, Telegraf } from "telegraf"
import { botDataProps } from "../bot"

export const botActions = (bot: Telegraf<Context>, botData: botDataProps) => {
    bot.action('back', ctx => {
        if (ctx.chat?.id)
        bot.telegram.editMessageReplyMarkup(ctx.chat?.id || 0, botData.lastMessageID[ctx.chat?.id], '0', {
            inline_keyboard : [
            [Markup.button.callback('Forward', 'forward')],
        ]
    })
    })
    bot.action('forward', ctx => {
        if (ctx.chat?.id)
        bot.telegram.editMessageReplyMarkup(ctx.chat?.id || 0, botData.lastMessageID[ctx.chat?.id], '0', {
            inline_keyboard : [
            [Markup.button.callback('Back', 'back')],
        ]
    })
    })
} 