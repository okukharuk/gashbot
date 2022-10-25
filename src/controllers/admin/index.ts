import axios from 'axios';
import { Context, Markup, Telegraf } from 'telegraf';

import Product from '../../models/product';
import {
  createInvoice,
  createInvoicePayment,
  createPlace,
  deleteProduct,
  getPlaces,
  getProduct,
  getProductsByPlace,
} from '../../routes';
import { collections } from '../../services/db.service';
import { onStart } from '../commands/command/start';
import { getBackButton, getDynamicInlineKeyboard, getStaticInlineKeyboard } from '../markup';
import { AdminItem, AdminUpdateItem } from '../markup/consts';

interface updatePropertyProps {
  name: string;
  kind: string;
}

const textInputType: Record<number, string> = {};
const propertyInputType: Record<number, updatePropertyProps> = {};

export const botAdmin = (bot: Telegraf<Context>) => {
  const newItem: Product = {
    place: "",
    name: "",
    price: 0,
    amount: 0,
    iid: 0,
  };

  bot.command("admin", (ctx) => {
    if (ctx.state.isAdmin) onAdmin(ctx);
    return;
  });

  bot.action("adminAddItem", (ctx) => {
    if (ctx.state.isAdmin) onAddItem(ctx);
    return;
  });

  bot.action("adminAddPlace", (ctx) => {
    if (ctx.state.isAdmin) onAddPlace(ctx);
    return;
  });

  bot.on("callback_query", async (ctx) => {
    const info = (ctx.callbackQuery.data || "").split(" ");
    const [label, type] = info;

    switch (type) {
      case "PlaceOpened":
        const inlineKeyboard = await getDynamicInlineKeyboard(
          " ProductChosen",
          async () => await getProductsByPlace(label),
          undefined,
          getBackButton((ctx.callbackQuery && ctx.callbackQuery.data) || "")
        );
        ctx.editMessageText("choose wisely", inlineKeyboard);
        return;
      case "StartOpened":
        onStart(ctx);
        return;
      case "ProductChosen":
        const chosenProduct = await getProduct(label);
        console.log(chosenProduct);
        const paymentURL = await createInvoicePayment(chosenProduct.data.iid);
        ctx.sendMessage(
          "Щоб оплатити перейдіть по ссилці та пройдіть вказані в ній інструкції: " +
            paymentURL
        );
    }

    if (ctx.state.isAdmin) {
      switch (type) {
        case "AdminOpened":
          onAdmin(ctx);
          return;
        case "AdminPlaceOpened":
          newItem.place = label;
          onChoosePlace(ctx, label);
          return;
        case "ProductDelete":
          onDeleteItemQuery(ctx, label);
          return;
        case "ProductUpdate":
          onUpdateItemQuery(ctx, label);
          return;
        case "ProductUpdateItem":
          onUpdatePropertyQuery(ctx, label, info[2]);
          return;
        case "AdminAddItem":
          onAddItem(ctx);
          return;
        case "AdminDeleteItem":
          onDeleteItem(ctx, label);
          return;
        case "AdminUpdateItem":
          onUpdateItem(ctx, label);
          return;
      }
    }
  });

  bot.on("text", async (ctx) => {
    if (ctx.state.isAdmin)
      switch (textInputType[ctx.chat.id]) {
        case "addItemName":
          newItem.name = ctx.message.text;
          ctx.sendMessage("Item price:");
          textInputType[ctx.chat?.id || 0] = "addItemPrice";
          return;
        case "addItemPrice":
          newItem.price = Number(ctx.message.text);
          ctx.sendMessage("Item amount:");
          textInputType[ctx.chat?.id || 0] = "addItemAmount";
          return;
        case "addItemAmount":
          newItem.amount = Number(ctx.message.text);
          textInputType[ctx.chat?.id || 0] = "";
          const iid = await createInvoice(newItem.price, newItem.name);
          if (iid == null) {
            ctx.sendMessage("Item was not created");
            return;
          }
          newItem.iid = Number(iid);
          await axios
            .post("http://localhost:8080/product", newItem)
            .then((res) => {
              ctx.sendMessage("New item created!");
            })
            .catch((err) => {
              ctx.sendMessage("Item was not created");
            });
          return;
        case "addPlace":
          textInputType[ctx.chat?.id || 0] = "";
          await createPlace({ name: ctx.message.text }).then((res) => {
            res
              ? ctx.sendMessage("Place was created")
              : ctx.sendMessage("Place was not created");
          });
        case "updateItemProperty":
          try {
            const data = {
              [propertyInputType[ctx.chat.id].kind]: +ctx.message.text
                ? Number(ctx.message.text)
                : ctx.message.text,
            };
            const name = propertyInputType[ctx.chat.id].name;
            console.log(data, name);
            const result = await collections.product?.updateOne(
              { name: name },
              { $set: data }
            );
            console.log(result);
            result
              ? ctx.sendMessage("Property was successfully changed")
              : ctx.sendMessage("Property was not changed");
          } catch (err) {
            console.log(err);
          }
      }
  });
};

const onAdmin = async (ctx: Context) => {
  const inlineKeyboard = await getDynamicInlineKeyboard(
    " AdminPlaceOpened",
    getPlaces,
    [[Markup.button.callback("New place", "adminAddPlace")]]
  );
  ctx.callbackQuery
    ? ctx.editMessageText("Choose place:", inlineKeyboard)
    : ctx.reply("Choose place:", inlineKeyboard);
};

const onChoosePlace = (ctx: Context, label: string) => {
  console.log(ctx);
  ctx.editMessageText(
    "Welcome Master",
    getStaticInlineKeyboard(
      AdminItem,
      label,
      getBackButton((ctx.callbackQuery && ctx.callbackQuery.data) || "")
    )
  );
};

const onAddItem = (ctx: Context) => {
  textInputType[ctx.chat?.id || 0] = "addItemName";
  ctx.sendMessage("Write item name:");
};

const onDeleteItem = async (ctx: Context, label: string) => {
  const inlineKeyboard = await getDynamicInlineKeyboard(
    " ProductDelete",
    () => getProductsByPlace(label),
    undefined,
    getBackButton((ctx.callbackQuery && ctx.callbackQuery.data) || "")
  );
  ctx.editMessageText(`Delete Item:`, inlineKeyboard);
};

const onUpdateItem = async (ctx: Context, label: string) => {
  const inlineKeyboard = await getDynamicInlineKeyboard(
    " ProductUpdate",
    () => getProductsByPlace(label),
    undefined,
    getBackButton((ctx.callbackQuery && ctx.callbackQuery.data) || "")
  );
  ctx.editMessageText(`Update Item:`, inlineKeyboard);
};

const onAddPlace = async (ctx: Context) => {
  textInputType[ctx.chat?.id || 0] = "addPlace";
  ctx.sendMessage("Write place name:");
};

const onDeleteItemQuery = async (ctx: Context, name: string) => {
  deleteProduct(name)
    .then((res) => {
      ctx.sendMessage("Item was successfully deleted");
    })
    .catch((err) => {
      ctx.sendMessage("Item was not deleted");
    });
};

const onUpdateItemQuery = async (ctx: Context, name: string) => {
  ctx.reply(
    "What property to change:",
    getStaticInlineKeyboard(AdminUpdateItem, name)
  );
};

const onUpdatePropertyQuery = (ctx: Context, name: string, kind: string) => {
  textInputType[ctx.chat?.id || 0] = "updateItemProperty";
  propertyInputType[ctx.chat?.id || 0] = {
    name: name,
    kind: kind.toLowerCase(),
  };
  ctx.sendMessage("Write new property:");
};

const onCreateNewItem = () => {};
