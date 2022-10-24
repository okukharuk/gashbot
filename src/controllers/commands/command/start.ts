import { Context } from 'telegraf';

import { createUser, getPlaces, getUser } from '../../../routes';
import { MenuInterface } from '../../consts';
import { getDynamicInlineKeyboard } from '../../markup';

export const onStart = async (ctx: Context) => {
  const inlineKeyboard = await getDynamicInlineKeyboard(
    " placeOpened",
    getPlaces
  );
  ctx.state.place = 1;
  await getUser(ctx.chat?.id || 0)
    .then(async (res) => {
      return await ctx.reply(
        MenuInterface(ctx.chat?.id || 0, res.data.balance),
        inlineKeyboard
      );
    })
    .catch(async (err) => {
      await createUser({
        chatID: ctx.chat?.id || 0,
        balance: 0,
      });
      return await ctx.reply(
        MenuInterface(ctx.chat?.id || 0, 0),
        inlineKeyboard
      );
    });
  return;
};
