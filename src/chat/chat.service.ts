import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { ChatModel } from "./chat.model"
import { UserModel } from "../user/user.model"
import { ChatDto } from "./dto/chat.dto"

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatModel) private readonly ChatModel: ModelType<ChatModel>,
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}
  async createChat(senderId: number, receiverId: number) {
    const sender = await this.UserModel.findOne({ id: senderId })
    if (!sender)
      throw new NotFoundException(`User with id: ${senderId} not found`)
    const receiver = await this.UserModel.findOne({ id: receiverId })
    if (!receiver)
      throw new NotFoundException(`User with id: ${receiverId} not found`)
    const chat = await this.ChatModel.create({
      users: [sender, receiver]
    })
    return await chat.save()
  }
  async sendMessage(dto: ChatDto) {
    // const sender = await this.UserModel.findOne({ id: senderId })
    // if (!sender)
    //   throw new NotFoundException(`User with id: ${senderId} not found`)
    // const receiver = await this.UserModel.findOne({ id: receiverId })
    // if (!receiver)
    //   throw new NotFoundException(`User with id: ${receiverId} not found`)
    // const chat = await this.ChatModel.create({
    //   users: [sender, receiver]
    // })
    // return await chat.save()
  }
}
