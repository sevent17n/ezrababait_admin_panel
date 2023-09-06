import { Module } from "@nestjs/common"
import { TelegrafModule } from "nestjs-telegraf"
import * as LocalSession from "telegraf-session-local"
import { BotUpdate } from "./bot.update"
import {
  EmailScene,
  NameScene,
  PhoneScene,
  RegistrationScene
} from "./scenes/registration.scene"
import { TypegooseModule } from "nestjs-typegoose"
import { UserModel } from "../user/user.model"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { getJWTConfig } from "../config/jwt.config"
import { AuthService } from "../auth/auth.service"

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
    NameScene,
    EmailScene,
    PhoneScene,
    AuthService
  ],
  controllers: []
})
export class BotModule {}
