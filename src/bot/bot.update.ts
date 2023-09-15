import { Ctx, InjectBot, On, Start, Update } from "nestjs-telegraf"
import { Markup, Telegraf } from "telegraf"
import { menuButton, UsersKeyboard } from "./bot.buttons"
import { FIND_BY_SCENE, REGISTRATION_SCENE } from "./bot.constants"
import { Context } from "./bot.interface"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { BotPostsModel } from "./bot_posts.model"

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @InjectModel(BotPostsModel)
    private readonly Post: ModelType<BotPostsModel>
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const userid = ctx.message.from.id.toString()
    const first_name = ctx.message.from.first_name

    await ctx.reply("hello", menuButton(userid, first_name))
  }

  @On("callback_query")
  async register(@Ctx() ctx: Context) {
    try {
      //@ts-ignore
      const data = ctx.callbackQuery.data

      if (data === "register_housekeeper") {
        await ctx.scene.enter(REGISTRATION_SCENE)
      } else if (data.startsWith("user_")) {
        const userId = parseInt(data.substring(5))
        const user = await this.Post.findOne({ id: userId })
        const users = await this.Post.find()

        if (!user) {
          ctx.answerCbQuery("User not found")
          return
        }
        const {
          first_name,
          last_name,
          image_url,
          address,
          coordinates,
          phone,
          email,
          username
        } = user

        const googleMapsLink = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
        const userProfileLink = `https://t.me/${username}`
        await ctx.telegram.sendPhoto(
          ctx.chat.id,
          { url: image_url },
          {
            caption: `Name: ${first_name}\nLast Name: ${last_name}\nAddress: ${address}\nPhone: ${phone}\nEmail: ${email}\n\n[Open in Google Maps](${googleMapsLink})\n\n[User Profile](${userProfileLink})`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: UsersKeyboard(users)
            }
          }
        )
      }
    } catch (e) {
      console.log(e)
    }
  }

  @On("message")
  async commandHandler(@Ctx() ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = ctx.message.text

    if (data === "/check_requests") {
      const users = await this.Post.find()

      ctx.reply("Select a user:", {
        reply_markup: {
          inline_keyboard: UsersKeyboard(users)
        }
      })
    } else if (data === "/find") {
      await ctx.scene.enter(FIND_BY_SCENE)
    }
  }
}
