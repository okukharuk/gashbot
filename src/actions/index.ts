import axios from "axios"
import { Context, Markup, Telegraf } from "telegraf"
import { botDataProps } from "../bot"
import dotenv from "dotenv"

export const botActions = (bot: Telegraf<Context>, botData: botDataProps) => {
    dotenv.config();

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
    bot.action('check', async(ctx) => {
        /*axios.get('https://api-sandbox.nowpayments.io/v1/status')
            .then(res => console.log(res.data))
            .catch(err => console.log(err))*/
        /*axios.get('https://api-sandbox.nowpayments.io/v1/currencies', {
            headers: {
                'x-api-key': process.env.NOWPAY_DEMO
            }
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))*/
        /*axios.get('https://api-sandbox.nowpayments.io/v1/estimate?amount=4000&currency_from=usd&currency_to=usdttrc20', {
            headers: {
                'x-api-key': process.env.NOWPAY_DEMO
            }
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))*/
        /*const url = await axios.post('https://api.nowpayments.io/v1/invoice',
        {
            "price_amount": 3,
            "price_currency": "usd",
            "pay_currency": "usdttrc20",
            "order_id": "12345",
            "order_description": "SCAM",
            "success_url": "https://google.com",
            "cancel_url": "https://google.com"
        },
        {
            headers: {
                'x-api-key': process.env.NOWPAY_API
            }
        })
            .then(res => {
                console.log(res.data)
                return res.data.invoice_url
            })
            .catch(err => console.log(err))
        bot.telegram.sendMessage(ctx.chat?.id || '', url)*/
        /*axios.get('https://api.nowpayments.io/v1/payment/4608951299', {
            headers: {
                'x-api-key': process.env.NOWPAY_API
            }
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))*/
    })
} 