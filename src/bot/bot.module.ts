import { Module } from "@nestjs/common"
import { TelegrafModule } from "nestjs-telegraf"
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
import { BotPostsModel } from "./bot_posts.model"
import { BotService } from "./bot.service"
import { BotController } from "./bot.controller"
import {
  FindByAreaScene,
  FindByEmailScene,
  FindByFullNameScene,
  FindByNameScene,
  FindByPhoneScene,
  FindByScene
} from "./scenes/find_by.scene"
import { getTgConfig } from "../config/tg.config"

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: getTgConfig
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "User"
        }
      },
      {
        typegooseClass: BotPostsModel,
        schemaOptions: {
          collection: "BotPost"
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
    AuthService,
    BotService,
    FindByScene,
    FirstNameScene,
    FindByFullNameScene,
    FindByNameScene,
    FindByAreaScene,
    FindByEmailScene,
    FindByPhoneScene
  ],
  controllers: [BotController]
})
export class BotModule {}
