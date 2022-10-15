import { Context, Middleware } from "telegraf";

export const isAdmin = () => (ctx: Context, next: () => Promise<void>) => {
    const adminArray = process.env.ADMIN_ID;
    if(ctx.chat?.id) 
        ctx.state.isAdmin = adminArray?.includes(ctx.chat.id.toString())
            ? true
            : false
    return next()
}