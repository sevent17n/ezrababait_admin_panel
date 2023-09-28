import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { UserModel } from "../user/user.model"
import { GroupModel } from "./group.model"
import { ConfigModule } from "@nestjs/config"
import { GroupService } from "./group.service"
import { GroupController } from "./group.controller"
import { BotPostsModel } from "../bot/bot_posts.model"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "User"
        }
      },
      {
        typegooseClass: GroupModel,
        schemaOptions: {
          collection: "Group"
        }
      },
      {
        typegooseClass: BotPostsModel,
        schemaOptions: {
          collection: "BotPost"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
