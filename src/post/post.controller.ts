import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { PostService } from "./post.service"
import { Auth } from "../auth/decorators/auth.decorator"
import { PostDto } from "./dto/post.dto"

@Controller("posts")
export class PostController {
  constructor(private readonly PostService: PostService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("create_post")
  async createPost(@Body() dto: PostDto) {
    return await this.PostService.createPost(dto)
  }
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch("update_post")
  async updatePost(@Body() dto: PostDto, @Query("postId") postId: number) {
    return await this.PostService.updatePost(dto, postId)
  }
  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete("delete_post")
  async deletePost(@Query("postId") postId: number) {
    return await this.PostService.deletePost(postId)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch("apply_post")
  async applyPost(@Query("postId") postId: number) {
    return await this.PostService.applyPost(postId)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch("reject_post")
  async rejectPost(@Query("postId") postId: number) {
    return await this.PostService.rejectPost(postId)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("posts")
  async getPosts(@Query("query") query: string) {
    return await this.PostService.getPosts(query)
  }
}
