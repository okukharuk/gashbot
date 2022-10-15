import axios from "axios";
import { Context, Markup, Telegraf } from "telegraf";
import Product from "../../models/product";

const textInputType: Record<number, string> = {};

export const botAdmin = (bot: Telegraf<Context>) => {
    const newItem: Product = {
        name: '',
        price: 0,
        amount: 0
    };

    bot.command('admin', (ctx) => {
        if(ctx.state.isAdmin) onAdmin(ctx)
    })

    bot.action('adminAddItem', (ctx) => {
        if(ctx.state.isAdmin) onAddItem(ctx)
    })

    bot.action('adminDeleteItem', (ctx) => {
        if(ctx.state.isAdmin) onDeleteItem(ctx)
    })

    bot.on('callback_query', (ctx) => {
        if(ctx.state.isAdmin){
            const data = ctx.callbackQuery.data || '';
            data.includes('ProductDelete') ? onDeleteItemQuery(ctx, data.replace('ProductDelete', '')) : null;
        }
    })

    bot.on('text', async(ctx) => {
        if(ctx.state.isAdmin)
            switch(textInputType[ctx.chat.id]){
                case 'addItemName': 
                    newItem.name = ctx.message.text;
                    ctx.sendMessage('Item price:');
                    textInputType[ctx.chat?.id || 0] = 'addItemPrice';
                    return;
                case 'addItemPrice':
                    newItem.price = Number(ctx.message.text);
                    ctx.sendMessage('Item amount:');
                    textInputType[ctx.chat?.id || 0] = 'addItemAmount';
                    return;
                case 'addItemAmount':
                    newItem.amount = Number(ctx.message.text);
                    textInputType[ctx.chat?.id || 0] = '';
                    await axios.post('http://localhost:8080/product', newItem)
                        .then((res) => {
                            ctx.sendMessage('New item created!')
                        })
                        .catch((err) => {
                            ctx.sendMessage('Item was not created')
                        })
                    return;
        }
    })
}

const onAdmin = async(ctx: Context) => {
    ctx.reply('Welcome Master', Markup.inlineKeyboard([
        [Markup.button.callback('Add item', 'adminAddItem')],
        [Markup.button.callback('Delete item', 'adminDeleteItem')],
        [Markup.button.callback('Update item', 'adminUpdateItem')],
    ]))
}

const onAddItem = (ctx: Context) => {
    textInputType[ctx.chat?.id || 0] = 'addItemName';
    ctx.sendMessage('Write item name:');
}
const onDeleteItem = async(ctx: Context) => {
    const deleteProductMarkup = await getDeleteProductMarkup(ctx);
    ctx.reply(`Delete Item:`, 
                Markup.inlineKeyboard([
                    ...deleteProductMarkup,
                    [Markup.button.callback('Back', 'back')],
                    [Markup.button.callback('Check', 'check')],
                ])
            )
}

const onUpdateItem = async(ctx: Context) => {
    const deleteProductMarkup = await getDeleteProductMarkup(ctx);
    ctx.reply(`Update Item:`, 
                Markup.inlineKeyboard([
                    ...deleteProductMarkup,
                    [Markup.button.callback('Back', 'back')],
                    [Markup.button.callback('Check', 'check')],
                ])
            )
}

const onDeleteItemQuery = async(ctx: Context, name: string) => {
    axios.delete('http://localhost:8080/product/' + name)
        .then((res) => {
            ctx.sendMessage('Item was successfully deleted');
        }) 
        .catch((err) => {
            ctx.sendMessage('Item was not deleted');
        })
}

const getDeleteProductMarkup = async(ctx: Context) => {
    return await (await axios.get('http://localhost:8080/product')).data.map((el: Product) => {
            return [Markup.button.callback(el.name, el.name.toLowerCase() + 'ProductDelete')]
    })
}