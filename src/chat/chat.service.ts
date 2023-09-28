import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { ChatModel, MessageModel } from "./chat.model"
import { UserModel } from "../user/user.model"
import { CreateMessageDto } from "./dto/chat.dto"
import { Socket } from "socket.io"

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatModel) private readonly ChatModel: ModelType<ChatModel>,
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    @InjectModel(MessageModel)
    private readonly MessageModel: ModelType<MessageModel>
  ) {}

  clientToUser = {}
  async createChat(userIds: Array<number>, ownerId: number, group_id: string) {
    const owner = await this.UserModel.findOne({ id: ownerId })

    if (!owner) {
      throw new NotFoundException(`User with id: ${ownerId} not found`)
    }

    const users = await this.UserModel.find({ id: { $in: userIds } })

    if (!users || users.length === 0) {
      throw new NotFoundException(`Users not found`)
    }

    const chat = await this.ChatModel.create({
      users: [owner, ...users],
      owner_id: owner.id,
      group_id
    })
    owner.chats.push(String(chat._id))
    for (let i = 0; i < users.length; i++) {
      const member = users[i]
      member.chats.push(String(chat._id))
      await member.save()
    }
    return await chat.save()
  }
  async getChats(userId: number, client: Socket) {
    const user = await this.UserModel.findOne({ id: userId })
    this.clientToUser[client.id] = user

    const chats = await this.ChatModel.find({
      _id: { $in: user.chats }
    })
    if (user) {
      return { user, chats }
    } else {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
  }
  async getChat(chatId: string) {
    const chat = await this.ChatModel.findOne({
      group_id: chatId
    })

    if (chat) {
      return chat
    } else {
      throw new NotFoundException(`Chat with ID ${chatId} not found`)
    }
  }
  getClientUser(clientId: string) {
    return this.clientToUser[clientId]
  }
  async getMessages(chatId: string, page: number, pageSize: number) {
    const chat = await this.ChatModel.findById(chatId)
    if (!chat) {
      throw new NotFoundException("Chat room not found")
    }

    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize

    return chat.messages.slice(startIndex, endIndex)
  }
  async createMessage(dto: CreateMessageDto) {
    const sender = await this.UserModel.findOne({ id: dto.senderId })
    if (!sender)
      throw new NotFoundException(`User with id: ${dto.senderId} not found`)
    const chat = await this.ChatModel.findOne({
      _id: dto.chatId
    })
    const message = await this.MessageModel.create({
      content: dto.content,
      date: dto.date,
      read: false,
      chatId: dto.chatId,
      sender
    })

    chat.messages.push(message)
    await message.save()
    await chat.save()
    return message
  }
}
