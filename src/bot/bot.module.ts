import { Module } from "@nestjs/common"
import { TelegrafModule } from "nestjs-telegraf"
import * as LocalSession from "telegraf-session-local"
import { BotUpdate } from "./bot.update"
import {
  EmailScene,
  FirstNameScene,
  LastNameScene,
  SexScene,
  AddressScene,
  PhoneScene,
  AgeScene,
  PhotoScene,
  RegistrationScene
} from "./scenes/registration.scene"
import { TypegooseModule } from "nestjs-typegoose"
import { UserModel } from "../user/user.model"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { getJWTConfig } from "../config/jwt.config"
import { AuthService } from "../auth/auth.service"
import { BotQueueModel } from "./bot_queue.model"

const sessions = new LocalSession({ database: "session_db.json" })

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: "6305243242:AAHO6JxSBeqBkrHDtz5UHsRq7hBl2W4hMQk"
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "User"
        }
      },
      {
        typegooseClass: BotQueueModel,
        schemaOptions: {
          collection: "BotQueue"
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
  providers: [
    BotUpdate,
    RegistrationScene,
    FirstNameScene,
    LastNameScene,
    SexScene,
    AddressScene,
    EmailScene,
    AgeScene,
    PhotoScene,
    PhoneScene,
    AuthService
  ],
  controllers: []
})
export class BotModule {}
