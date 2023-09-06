import { Ctx, On, Scene, SceneEnter } from "nestjs-telegraf"

import {
  EMAIL_SCENE,
  NAME_SCENE,
  PHONE_SCENE,
  REGISTRATION_SCENE
} from "../bot.constants"
import { Context } from "../bot.interface"
import { ConfirmRegistrationButton } from "../bot.buttons"
import * as process from "process"
import axios from "axios"
import { AuthService } from "../../auth/auth.service"

@Scene(REGISTRATION_SCENE)
export class RegistrationScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Welcome to registration! Please enter your name:")
    context.session.user = {}
    await context.scene.enter(NAME_SCENE)
  }

  // @SceneLeave()
  // async leave(@Ctx() context: Context) {
  //
  // }
}

@Scene(NAME_SCENE)
export class NameScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your name:")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const name = context.message.text
      console.log(name)
      context.session.user.name = name
      await context.reply(`Thank you, ${name}! Now, please enter your email:`)
      await context.scene.enter(EMAIL_SCENE)
    } catch (error) {
      console.error(error)
    }
  }
}

@Scene(EMAIL_SCENE)
export class EmailScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your email:")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context.session.user.email = context.message.text
    await context.reply(`Thank you! Now, please enter your phone number:`)
    await context.scene.enter(PHONE_SCENE)
  }
}

@Scene(PHONE_SCENE)
export class PhoneScene {
  constructor(private readonly AuthService: AuthService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your phone number:")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const phone = context.message.text

    context.session.user.phone = phone
    context.session.user.id = context.message.from.id
    const { name, email } = context.session.user

    await context.reply(
      `Thank you for registering! Your information:\nName: ${name}\nEmail: ${email}\nPhone: ${phone} \n\n Is that correct?`,
      ConfirmRegistrationButton()
    )
  }
  @On("callback_query")
  async confirm(@Ctx() ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = ctx.callbackQuery.data
    if (data === "confirm_registration") {
      const { name, id } = ctx.session.user
      const { CHAT_ID } = process.env

      try {
        await axios.post(
          "https://api.telegram.org/bot6305243242:AAHO6JxSBeqBkrHDtz5UHsRq7hBl2W4hMQk/createForumTopic",
          {
            chat_id: CHAT_ID,
            name: name
          }
        )

        await this.AuthService.loginThroughBot(id)

        await ctx.reply("You successfully registered, check our group")
        await ctx.scene.leave()
      } catch (error) {
        console.error("Error creating forum topic:", error)
        await ctx.reply(
          "There was an error while creating the forum topic. Please try again later."
        )
      }
    } else {
      await ctx.scene.enter(REGISTRATION_SCENE)
    }
  }
}
