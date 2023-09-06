import { Ctx, InjectBot, On, Start, Update } from "nestjs-telegraf"
import { Telegraf } from "telegraf"
import { registrationButton } from "./bot.buttons"

import { REGISTRATION_SCENE } from "./bot.constants"
import { Context } from "./bot.interface"

@Update()
export class BotUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply("hello", registrationButton())
  }
  @On("callback_query")
  async register(@Ctx() ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = ctx.callbackQuery.data

    if (data === "register_housekeeper") {
      await ctx.scene.enter(REGISTRATION_SCENE)
    }
  }
}
