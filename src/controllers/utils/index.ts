import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import Place from '../../models/place';
import Product from '../../models/product';

export const toCorrectLength = (str: string[]) => {
  str[0] += str[0].length < 50 ? "⠀".repeat(50 - str[0].length) : "";
  return str.reduce((label, el) => {
    return label + "\n" + el;
  });
};

export const getMarkup = async (
  cb_type: string,
  getItems: () => Promise<any>
): Promise<InlineKeyboardButton[][]> => {
  return await (
    await getItems()
  ).data.map((el: Product | Place) => {
    return [Markup.button.callback(el.name, el.name + cb_type)];
  });
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
