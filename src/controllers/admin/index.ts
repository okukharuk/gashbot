import axios from 'axios';
import { Context, Markup, Telegraf } from 'telegraf';

import Product from '../../models/product';
import { createPlace, deleteProduct, getPlaces, getProducts, getProductsByPlace } from '../../routes';
import { collections } from '../../services/db.service';
import { getInlineKeyboard, getMarkup } from '../utils';

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
  };

  bot.command("admin", (ctx) => {
    if (ctx.state.isAdmin) onAdmin(ctx);
    return;
  });

  bot.action("adminAddItem", (ctx) => {
    if (ctx.state.isAdmin) onAddItem(ctx);
    return;
  });

  bot.action("adminDeleteItem", (ctx) => {
    if (ctx.state.isAdmin) onDeleteItem(ctx);
    return;
  });

  bot.action("adminUpdateItem", (ctx) => {
    if (ctx.state.isAdmin) onUpdateItem(ctx);
    return;
  });

  bot.action("adminAddPlace", (ctx) => {
    if (ctx.state.isAdmin) onAddPlace(ctx);
    return;
  });

  bot.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery.data || "";
    const info = data.split(" ");
    const [label, type] = info;
    switch (type) {
      case "placeOpened":
        const productMarkup = await getMarkup(
          "",
          async () => await getProductsByPlace(label)
        );
        console.log(productMarkup);
        ctx.reply("choose wisely", getInlineKeyboard(true, productMarkup));
    }
    if (ctx.state.isAdmin) {
      switch (type) {
        case "adminPlaceOpened":
          console.log("here");
          newItem.place = label;
          onChoosePlace(ctx);
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
  const placesMarkup = await getMarkup(" adminPlaceOpened", getPlaces);
  placesMarkup.push([Markup.button.callback("New place", "adminAddPlace")]);
  ctx.reply("Choose place:", getInlineKeyboard(false, placesMarkup));
};

const onChoosePlace = (ctx: Context) => {
  ctx.editMessageText(
    "Welcome Master",
    Markup.inlineKeyboard([
      [Markup.button.callback("Add item", "adminAddItem")],
      [Markup.button.callback("Delete item", "adminDeleteItem")],
      [Markup.button.callback("Update item", "adminUpdateItem")],
    ])
  );
};

const onAddItem = (ctx: Context) => {
  textInputType[ctx.chat?.id || 0] = "addItemName";
  ctx.sendMessage("Write item name:");
};
const onDeleteItem = async (ctx: Context) => {
  const deleteProductMarkup = await getMarkup(" ProductDelete", getProducts);
  ctx.reply(`Delete Item:`, getInlineKeyboard(true, deleteProductMarkup));
};

const onUpdateItem = async (ctx: Context) => {
  const updateProductMarkup = await getMarkup(" ProductUpdate", getProducts);
  ctx.reply(`Update Item:`, getInlineKeyboard(true, updateProductMarkup));
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
    Markup.inlineKeyboard([
      [Markup.button.callback("Name", name + " ProductUpdateItem Name")],
      [Markup.button.callback("Amount", name + " ProductUpdateItem Amount")],
      [Markup.button.callback("Price", name + " ProductUpdateItem Price")],
    ])
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
