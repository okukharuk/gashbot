import { Markup } from 'telegraf';
import { InlineKeyboardButton, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

import Place from '../../models/place';
import Product from '../../models/product';
import { BackMarkup } from './consts';

export const getStaticInlineKeyboard = (
  markup: Record<string, string>,
  label?: string,
  backMarkup?: InlineKeyboardButton.CallbackButton[]
) => {
  console.log(
    Object.entries(markup).map((data) => {
      return [Markup.button.callback(data[0], (label || "") + data[1])];
    })
  );
  return Markup.inlineKeyboard([
    ...Object.entries(markup).map((data) => {
      return [Markup.button.callback(data[0], (label || "") + data[1])];
    }),
    backMarkup ? backMarkup : [],
  ]);
};

export const getDynamicInlineKeyboard = async (
  cb_type: string,
  getItems: () => Promise<any>,
  additionalMarkup?: InlineKeyboardButton.CallbackButton[][],
  backMarkup?: InlineKeyboardButton.CallbackButton[]
): Promise<Markup.Markup<InlineKeyboardMarkup>> => {
  return Markup.inlineKeyboard([
    ...(await (
      await getItems()
    ).data.map((el: Product | Place) => {
      return [Markup.button.callback(el.name, el.name + cb_type)];
    })),
    ...(additionalMarkup ? additionalMarkup : []),
    backMarkup ? backMarkup : [],
  ]);
};

export const getInlineKeyboard = (
  back: boolean,
  items: InlineKeyboardButton[][]
) => {
  return Markup.inlineKeyboard([
    ...items,
    back ? simpleMarkupButton("Back") : [],
  ]);
};

export const simpleMarkupButton = (label: string) => {
  return [Markup.button.callback(label, label.toLowerCase())];
};

export const getBackButton = (data: string) => {
  const info = data.split(" ");
  const [label, type] = info;
  return [Markup.button.callback("Back", label + " " + BackMarkup[type])];
};
