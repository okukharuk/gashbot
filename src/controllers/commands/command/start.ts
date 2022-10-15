import axios from "axios";
import { Context, Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import Product from "../../../models/product";

const getProductMarkup = async(): Promise<InlineKeyboardButton[][]> => {
    return await (await axios.get('http://localhost:8080/product')).data.map((el: Product) => {
        return [Markup.button.callback(el.name, el.name.toLowerCase())]
    })

}

export const onStart = async(ctx: Context) => {
    console.log(ctx.state.isAdmin)

    await axios.get('http://localhost:8080/users/' + ctx.chat?.id, {timeout: 1000})
        .then(async(res) => {
            const productMarkup: InlineKeyboardButton[][] = await getProductMarkup();
            return await ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: ${res.data.balance}`, 
                Markup.inlineKeyboard([
                    ...productMarkup,
                    [Markup.button.callback('Back', 'back')],
                    [Markup.button.callback('Check', 'check')],
                ])
            )
        })
        .catch(async(err) => {
            axios.post('http://localhost:8080/users', {
                chatID: ctx.chat?.id || 0,
                balance: 0
            })
            return await ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: 0`)
        })
    return;
}
