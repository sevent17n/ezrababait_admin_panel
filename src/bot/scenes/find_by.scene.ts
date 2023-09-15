import { Ctx, Hears, On, Scene, SceneEnter } from "nestjs-telegraf"
import {
  FIND_BY_AREA,
  FIND_BY_EMAIL,
  FIND_BY_FULL_NAME,
  FIND_BY_NAME,
  FIND_BY_PHONE,
  FIND_BY_SCENE
} from "../bot.constants"
import { Context } from "../bot.interface"
import { Markup } from "telegraf"
import { BotService } from "../bot.service"
import { UsersKeyboard } from "../bot.buttons"

@Scene(FIND_BY_SCENE)
export class FindByScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply(
      "Select method to find person",
      Markup.keyboard(
        ["by full name", "by email", "by phone", "by area name", "by name"],
        {
          columns: 2
        }
      )
    )
  }
  @Hears("by name")
  async byName(@Ctx() context: Context) {
    await context.scene.enter(FIND_BY_NAME)
  }
  @Hears("by full name")
  async byFullName(@Ctx() context: Context) {
    await context.scene.enter(FIND_BY_FULL_NAME)
  }
  @Hears("by email")
  async byEmail(@Ctx() context: Context) {
    await context.scene.enter(FIND_BY_EMAIL)
  }
  @Hears("by phone")
  async byPhone(@Ctx() context: Context) {
    await context.scene.enter(FIND_BY_PHONE)
  }
  @Hears("by area name")
  async byArea(@Ctx() context: Context) {
    await context.scene.enter(FIND_BY_AREA)
  }
}
@Scene(FIND_BY_FULL_NAME)
export class FindByFullNameScene {
  constructor(private readonly BotService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter full name")
  }
  @On("text")
  async findByFullName(@Ctx() context: Context) {
    // @ts-ignore
    const text = context.message.text

    const regex = /^[a-zA-Z]+\s[a-zA-Z]+$/

    if (!regex.test(text)) {
      await context.reply("Please enter a valid full name.")
      return
    }

    const [first_name, last_name] = text.split(" ")

    try {
      const users = await this.BotService.findByQuery({ first_name, last_name })

      await context.reply(
        `Found users: `,
        Markup.inlineKeyboard(UsersKeyboard(users))
      )
      await context.scene.leave()
    } catch (error) {
      console.error(error)
      await context.reply("User not found or an error occurred.")
      await context.scene.leave()
    }
  }
}
@Scene(FIND_BY_NAME)
export class FindByNameScene {
  constructor(private readonly BotService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter name")
  }
  @On("text")
  async findByName(@Ctx() context: Context) {
    // @ts-ignore
    const text = context.message.text

    const regex = /^[a-zA-Z]+$/

    if (!regex.test(text)) {
      await context.reply("Please enter a valid full name.")
      return
    }

    try {
      const users = await this.BotService.findByQuery({ first_name: text })

      await context.reply(
        `Found users: `,
        Markup.inlineKeyboard(UsersKeyboard(users))
      )
      await context.scene.leave()
    } catch (error) {
      console.error(error)
      await context.reply("User not found or an error occurred.")
      await context.scene.leave()
    }
  }
}
@Scene(FIND_BY_AREA)
export class FindByAreaScene {
  constructor(private readonly BotService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter area name")
  }
  @On("text")
  async findByFullName(@Ctx() context: Context) {
    // @ts-ignore
    const text = context.message.text

    try {
      const users = await this.BotService.findByQuery({ address: text })
      await context.reply(
        `Found users: `,
        Markup.inlineKeyboard(UsersKeyboard(users))
      )
      await context.scene.leave()
    } catch (error) {
      console.error(error)
      await context.reply("User not found or an error occurred.")
      await context.scene.leave()
    }
  }
}
@Scene(FIND_BY_PHONE)
export class FindByPhoneScene {
  constructor(private readonly BotService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter phone")
  }
  @On("text")
  async findByPhone(@Ctx() context: Context) {
    // @ts-ignore
    const text = context.message.text
    const phoneRegex = /^\+?[0-9]*$/

    if (!phoneRegex.test(text)) {
      await context.reply("Please enter a valid phone number (digits only).")
      return
    }
    try {
      const users = await this.BotService.findByQuery({ phone: text })
      await context.reply(
        `Found users: `,
        Markup.inlineKeyboard(UsersKeyboard(users))
      )
      await context.scene.leave()
    } catch (error) {
      console.error(error)
      await context.reply("User not found or an error occurred.")
      await context.scene.leave()
    }
  }
}
@Scene(FIND_BY_EMAIL)
export class FindByEmailScene {
  constructor(private readonly BotService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter email")
  }
  @On("text")
  async FindByEmail(@Ctx() context: Context) {
    // @ts-ignore
    const text = context.message.text

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    if (!emailRegex.test(text)) {
      await context.reply("Please enter a valid email address.")
      return
    }
    try {
      const users = await this.BotService.findByQuery({ email: text })
      await context.reply(
        `Found users: `,
        Markup.inlineKeyboard(UsersKeyboard(users))
      )
      await context.scene.leave()
    } catch (error) {
      console.error(error)
      await context.reply("User not found or an error occurred.")
      await context.scene.leave()
    }
  }
}
