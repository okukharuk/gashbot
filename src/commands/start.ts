import axios from "axios";
import { Context, Markup } from "telegraf";

export let lastMessageId = 0;

export const onStart = async(ctx: Context) => {

    const a = await axios.get('http://localhost:8080/users/' + ctx.chat?.id, {timeout: 1000})
        .then(async(res) => {
            return await ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: ${res.data.balance}`, 
            Markup.inlineKeyboard([
                [Markup.button.callback('Back', 'back')],
                [Markup.button.callback('Check', 'check')],
            ]))
        })
        .catch(async(err) => {
            axios.post('http://localhost:8080/users', {
                chatID: ctx.chat?.id || 0,
                balance: 0
            })
            return await ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: 0`)
        })
    return [ctx.chat?.id, a.message_id]
}
