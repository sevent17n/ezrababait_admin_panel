import { Injectable } from "@nestjs/common"
import { Telegraf } from "telegraf"
import * as process from "process"

@Injectable()
export class BotService {
  private bot: Telegraf

  constructor() {
    const { TOKEN } = process.env
    this.bot = new Telegraf(TOKEN)

    this.setupHandlers()
  }

  async sendMessageToChannel(channelId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(channelId, message)
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error)
    }
  }
  private setupHandlers() {
    this.bot.command("start", (ctx) => {
      ctx.reply("Привет! Я бот.")
    })
  }

  startBot() {
    this.bot.launch()
  }
}
