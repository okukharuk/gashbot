import { Context, Markup } from 'telegraf';

import { createUser, getPlaces, getUser } from '../../../routes';
import { MenuInterface } from '../../consts';
import { getDynamicInlineKeyboard } from '../../markup';

export const onStart = async (ctx: Context) => {
  const inlineKeyboard = await getDynamicInlineKeyboard(
    " PlaceOpened",
    getPlaces,
    [[Markup.button.callback("check", "check")]]
  );
  await getUser(ctx.chat?.id || 0)
    .then(async (res) => {
      ctx.callbackQuery
        ? await ctx.editMessageText(
            MenuInterface(ctx.chat?.id || 0, res.data.balance),
            inlineKeyboard
          )
        : await ctx.reply(
            MenuInterface(ctx.chat?.id || 0, res.data.balance),
            inlineKeyboard
          );
    })
    .catch(async (err) => {
      await createUser({
        chatID: ctx.chat?.id || 0,
        balance: 0,
      });
      ctx.reply(MenuInterface(ctx.chat?.id || 0, 0), inlineKeyboard);
    });
  return;
};
