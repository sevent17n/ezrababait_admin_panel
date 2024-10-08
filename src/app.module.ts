import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypegooseModule } from "nestjs-typegoose"
import { getMongoDbConfig } from "./config/mongo.config"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { GroupModule } from "./group/group.module"
import { FileModule } from "./file/file.module"
import { PostModule } from "./post/post.module"
import { ChatModule } from "./chat/chat.module"
import { BotModule } from "./bot/bot.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig
    }),
    AuthModule,
    UserModule,
    GroupModule,
    FileModule,
    PostModule,
    ChatModule,
    BotModule
  ],
  providers: [],
  controllers: []
})
export class AppModule {}
