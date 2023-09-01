import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { ConfigModule } from "@nestjs/config"
import { ChatModel } from "./chat.model"
import { ChatService } from "./chat.service"
import { ChatController } from "./chat.controller"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ChatModel,
        schemaOptions: {
          collection: "Chat"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
