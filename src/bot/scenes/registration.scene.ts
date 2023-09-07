import { Ctx, On, Scene, SceneEnter } from "nestjs-telegraf"

import {
  ADDRESS_SCENE,
  AGE_SCENE,
  EMAIL_SCENE,
  FIRST_NAME_SCENE,
  LAST_NAME_SCENE,
  PHONE_SCENE,
  PHOTO_SCENE,
  REGISTRATION_SCENE,
  SEX_SCENE
} from "../bot.constants"
import { Context } from "../bot.interface"
import { ConfirmRegistrationButton, SexButton } from "../bot.buttons"
import * as process from "process"
import axios from "axios"
import { AuthService } from "../../auth/auth.service"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { InjectModel } from "nestjs-typegoose"
import { BotQueueModel } from "../bot_queue.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { InputMediaPhoto } from "telegraf/types"

@Scene(REGISTRATION_SCENE)
export class RegistrationScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Welcome to registration! Please enter your name:")
    context.session.user = {}
    await context.scene.enter(FIRST_NAME_SCENE)
  }
}

@Scene("FIRST_NAME_SCENE")
export class FirstNameScene {
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
      const username = context.message.from.username

      if (!username) {
        await context.reply(
          "To start, you have to create a username in Telegram."
        )
      } else {
        // Regular expression to check if the name contains only letters
        const isValidName = /^[a-zA-Z]+$/.test(name)

        if (!isValidName) {
          await context.reply(
            "First name should only contain letters. Please enter a valid first name:"
          )
        } else {
          context.session.user.first_name = name
          context.session.user.username = username
          await context.reply(
            `Thank you, ${name}! Now, please enter your last name:`
          )
          await context.scene.enter(LAST_NAME_SCENE)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
@Scene(LAST_NAME_SCENE)
export class LastNameScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your last name:")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const lastName = context.message.text

      const isValidLastName = /^[a-zA-Z]+$/.test(lastName)
      if (!isValidLastName) {
        await context.reply(
          "Last name should only contain letters. Please enter a valid last name:"
        )
      } else {
        context.session.user.last_name = lastName
        await context.reply("Now, please enter your email:")
        await context.scene.enter(EMAIL_SCENE)
      }
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
    const email = context.message.text.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      await context.reply("Please enter a valid email address.")
      return
    }

    context.session.user.email = email

    await context.reply(`Now, please select your gender :`)
    await context.scene.enter(SEX_SCENE)
  }
}

@Scene(SEX_SCENE)
export class SexScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Select your gender: ", SexButton())
  }

  @On("callback_query")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = context.callbackQuery.data
    data === "male"
      ? (context.session.user.sex = "male")
      : (context.session.user.sex = "female")

    await context.scene.enter(AGE_SCENE)
  }
}
@Scene(AGE_SCENE)
export class AgeScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your age: ")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const age = parseInt(context.message.text.trim(), 10)

      if (isNaN(age) || age < 0 || age > 150) {
        await context.reply("Please enter a valid age.")
        return
      }

      context.session.user.age = age
      await context.scene.enter(PHOTO_SCENE)
    } catch (error) {
      console.error(error)
    }
  }
}

@Scene(PHOTO_SCENE)
export class PhotoScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Send your photo: ")
  }

  @On("photo")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const last_index = context.message.photo.length - 1

    const image_url = await context.telegram.getFileLink(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context.message.photo[last_index].file_id
    )
    context.session.user.image_url = image_url.toString()
    await context.scene.enter(ADDRESS_SCENE)
  }
}
@Scene(ADDRESS_SCENE)
export class AddressScene {
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Send your location")
  }

  @On("location")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lat = context.message.location.latitude
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lng = context.message.location.longitude

    context.session.user.address = { lat, lng }

    await context.reply(`Now, please enter your phone number:`)
    await context.scene.enter(PHONE_SCENE)
  }
}
@Scene(PHONE_SCENE)
export class PhoneScene {
  constructor(
    private readonly AuthService: AuthService,
    @InjectModel(BotQueueModel)
    private readonly BotQueueModel: ModelType<BotQueueModel>
  ) {}
  @SceneEnter()
  async enter(@Ctx() context: Context) {
    await context.reply("Enter your phone number:")
  }

  @On("text")
  async onAnswer(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const phone = context.message.text.trim()

    const phoneNumber = parsePhoneNumberFromString(phone)

    if (!phoneNumber || !phoneNumber.isValid()) {
      await context.reply("Please enter a valid phone number.")
      return
    }
    context.session.user.phone = phoneNumber.formatInternational()

    context.session.user.id = context.message.from.id
    const { first_name, last_name, email, address, sex, image_url, age } =
      context.session.user

    await context.replyWithPhoto(
      { url: image_url },
      {
        caption: `Thank you for registering! Your information:\nName: ${first_name}\nLast Name: ${last_name}\nEmail: ${email}\nPhone: ${phone} \nlocation: lat: ${address.lat.toString()} lng: ${address.lng.toString()}\n gender: ${sex} \n age: ${age} \n\n Is that correct? `,
        reply_markup: ConfirmRegistrationButton()
      }
    )
  }
  @On("callback_query")
  async confirm(@Ctx() context: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = context.callbackQuery.data

    if (data === "confirm_registration") {
      const { CHAT_ID } = process.env
      const {
        id,
        first_name,
        last_name,
        email,
        username,
        address,
        sex,
        image_url,
        age,
        phone
      } = context.session.user
      try {
        let queue = await this.BotQueueModel.findOne()
        if (!queue) {
          const newQueue = new this.BotQueueModel()
          await newQueue.save()
          queue = newQueue
        }
        function PostButton() {
          const buttons = queue.posts.map((post) => ({
            text: `${post.first_name} ${post.last_name}`,
            url: `https://t.me/${post.username}`
          }))

          const rows = []
          for (let i = 0; i < buttons.length; i += 3) {
            const row = buttons.slice(i, i + 3)
            rows.push(row)
          }

          const inline_keyboard = rows.map((row) => row.map((button) => button))
          return { inline_keyboard }
        }
        const { data } = await axios.post(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${address.lat},${address.lng}&key=${process.env.GOOGLE_GECOCODING_TOKEN}`
        )
        const formatted_address = data.results[0].formatted_address

        const postPush = () => {
          queue.posts.push({
            image_url,
            first_name,
            last_name,
            profile_url: `https://t.me/${username}`,
            age,
            email,
            phone,
            sex,
            address: formatted_address,
            username
          })

          return queue.save()
        }

        if (queue.posts.length >= 2) {
          postPush()
          // await context.telegram.sendPhoto(
          //   -1001752755065,
          //   { url: image_url },
          //   {
          //     caption: `Name: ${first_name}\nLast Name: ${last_name}\nEmail: ${email}\nPhone: ${phone} \nlocation: lat: ${address.lat.toString()} lng: ${address.lng.toString()}\n gender: ${sex} \n age: ${age}`,
          //     reply_markup: PostButton()
          //   }
          // )
          const captions = queue.posts.map((post) => {
            return `Name: ${post.first_name}\nLast Name: ${post.last_name}\nEmail: ${post.email}\nPhone: ${phone} \naddress: ${post.address}\n gender: ${post.sex} \n age: ${post.age}`
          })

          const caption = captions.join("\n\n")
          const imageUrls = queue.posts.map((post) => post.image_url)

          const media: InputMediaPhoto[] = imageUrls.map((imageUrl) => ({
            type: "photo",
            media: { url: imageUrl },
            caption: caption
          }))

          await context.telegram.sendMediaGroup(-1001752755065, media)
          await context.telegram.sendMessage(-1001752755065, caption, {
            reply_markup: PostButton()
          })
          queue.deleteOne()
        } else {
          postPush()
        }

        await axios.post(
          "https://api.telegram.org/bot6305243242:AAHO6JxSBeqBkrHDtz5UHsRq7hBl2W4hMQk/createForumTopic",
          {
            chat_id: CHAT_ID,
            name: first_name
          }
        )

        await this.AuthService.loginThroughBot(id)

        await context.reply("You successfully registered, check our group")
        await context.scene.leave()
      } catch (error) {
        console.error("Error creating forum topic:", error)
        await context.reply(
          "There was an error while creating the forum topic. Please try again later."
        )
      }
    } else {
      await context.scene.enter(REGISTRATION_SCENE)
    }
  }
}
