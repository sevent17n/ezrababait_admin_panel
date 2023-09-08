import { InjectModel } from "nestjs-typegoose"
import { BotPostsModel } from "./bot_posts.model"
import { ModelType } from "@typegoose/typegoose/lib/types"

export class BotService {
  constructor(
    @InjectModel(BotPostsModel)
    private readonly BotQueueModel: ModelType<BotPostsModel>
  ) {}
  async getRequests() {
    return this.BotQueueModel.find()
  }
}
