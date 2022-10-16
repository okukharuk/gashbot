import axios from "axios";
import { Context, Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import Product from "../../../models/product";
import { createUser, getPlaces, getProducts, getUser } from "../../../routes";
import { MenuInterface } from "../../consts";
import { getInlineKeyboard, getMarkup } from "../../utils";

export const onStart = async(ctx: Context) => {
    const placeMarkup: InlineKeyboardButton[][] = await getMarkup(' placeOpened', getPlaces);
    await getUser(ctx.chat?.id || 0)
        .then(async(res) => {
            return await ctx.reply(
                MenuInterface(ctx.chat?.id || 0, res.data.balance), 
                getInlineKeyboard(true, placeMarkup)
            )
        })
        .catch(async(err) => {
            await createUser({
                chatID: ctx.chat?.id || 0,
                balance: 0
            })
            return await ctx.reply(
                MenuInterface(ctx.chat?.id || 0, 0), 
                getInlineKeyboard(true, placeMarkup)
            )
        })
    return;
}
