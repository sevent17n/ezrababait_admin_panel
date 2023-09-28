import { ChatService } from "./chat.service"
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CreateMessageDto } from "./dto/chat.dto"
import { WsAuth } from "../auth/decorators/auth.decorator"
import { InternalServerErrorException } from "@nestjs/common"
import { MessageModel } from "./chat.model"

@WebSocketGateway(81, {
  transports: ["polling"],
  cors: {
    //TODO: make it APP_URL from .env
    origin: "*"
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly ChatService: ChatService) {}

  @WsAuth()
  @SubscribeMessage("create_message")
  async createMessage(@MessageBody() dto: CreateMessageDto) {
    const message = await this.ChatService.createMessage(dto)

    this.server.emit("new_message", message)
  }

  @WsAuth()
  @SubscribeMessage("get_messages")
  async getLastMessages(
    @MessageBody() data: { chatId: string; page: number; pageSize: number },
    @ConnectedSocket() client: Socket
  ) {
    const { chatId, page, pageSize } = data

    try {
      const messages = await this.ChatService.getMessages(
        chatId,
        page,
        pageSize
      )
      client.emit("messages", messages)

      client.join(chatId)

      client.on("new_message", (message) => {
        client.emit("new_message", message)
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
  @WsAuth()
  @SubscribeMessage("join_chats")
  async getChats(
    @MessageBody("userId") userId: number,
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.ChatService.getChats(userId, client)

    for (const chatId of user.chats) {
      if (typeof chatId === "string") {
        client.join(chatId as string)
      }
    }
    client.emit("user_joined", user)
    return user
  }
  @WsAuth()
  @SubscribeMessage("get_chat")
  async getChat(
    @MessageBody("chatId") chatId: string,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.ChatService.getChat(chatId)

    client.emit("got_chat", chat)
    return chat
  }
  @WsAuth()
  @SubscribeMessage("typing")
  async typing(
    @MessageBody() data: { isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.ChatService.getClientUser(client.id)

    client.broadcast.emit("typing", { user, isTyping: data.isTyping })

    return { user, data }
  }

  @SubscribeMessage("create_chat")
  async createChat(
    @MessageBody()
    data: { userIds: number[]; ownerId: number; group_id: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const { userIds, ownerId, group_id } = data
      const chat = await this.ChatService.createChat(userIds, ownerId, group_id)

      client.emit("chat_created", chat)

      return chat
    } catch (error) {
      console.error(error)
      throw new WsException("Failed to create a chat")
    }
  }
}
