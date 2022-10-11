import axios from "axios";
import { Context } from "telegraf";

export const onStart = async(ctx: Context) => {
    await axios.get('http://localhost:8080/users/' + ctx.chat?.id, {timeout: 1000})
        .then(res => {
            ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: ${res.data.balance}`)
        })
        .catch(async(err) => {
            axios.post('http://localhost:8080/users', {
                chatID: ctx.chat?.id || 0,
                balance: 0
            })
            ctx.reply(`Твій айді: ${ctx.chat?.id}\nБаланс: 0`)
        })
}
