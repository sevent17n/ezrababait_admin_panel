import { Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { ChatModel } from "./chat.model"

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatModel) private readonly ChatModel: ModelType<ChatModel>
  ) {}
  async createChat() {}
}
