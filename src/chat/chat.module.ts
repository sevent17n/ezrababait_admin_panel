import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ChatModel, MessageModel } from "./chat.model"
import { ChatService } from "./chat.service"
import { ChatGateway } from "./chat.gateway"
import { UserModel } from "../user/user.model"
import { JwtModule } from "@nestjs/jwt"
import { getJWTConfig } from "../config/jwt.config"
import { JwtStrategy } from "../auth/strategies/jwt.strategy"

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
      },
      {
        typegooseClass: MessageModel,
        schemaOptions: {
          collection: "Messages"
        }
      }
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  providers: [ChatService, ChatGateway, JwtStrategy]
})
export class ChatModule {}
