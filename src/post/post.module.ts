import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { ConfigModule } from "@nestjs/config"
import { PostModel } from "./post.model"
import { PostService } from "./post.service"
import { PostController } from "./post.controller"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PostModel,
        schemaOptions: {
          collection: "Post"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
