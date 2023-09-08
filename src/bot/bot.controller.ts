import { Controller, Get } from "@nestjs/common"
import { BotService } from "./bot.service"

@Controller("bot")
export class BotController {
  constructor(private readonly BotService: BotService) {}

  @Get()
  async getRequests() {
    return await this.BotService.getRequests()
  }
}
