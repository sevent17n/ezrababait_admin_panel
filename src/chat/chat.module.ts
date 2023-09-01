import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { ConfigModule } from "@nestjs/config"
import { ChatModel } from "./chat.model"
import { ChatService } from "./chat.service"
import { ChatController } from "./chat.controller"
import { UserModel } from "../user/user.model"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ChatModel,
        schemaOptions: {
          collection: "Chat"
        }
      },
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "User"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
