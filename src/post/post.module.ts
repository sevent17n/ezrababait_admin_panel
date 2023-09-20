import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { ConfigModule } from "@nestjs/config"
import { PostModel } from "./post.model"
import { PostService } from "./post.service"
import { PostController } from "./post.controller"
import { BotPostsModel } from "../bot/bot_posts.model"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: {
          collection: "Post"
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
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
