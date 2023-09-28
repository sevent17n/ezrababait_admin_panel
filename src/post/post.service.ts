import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { PostModel } from "./post.model"
import { PostDto } from "./dto/post.dto"
import Fuse from "fuse.js"
import { BotPostsModel } from "../bot/bot_posts.model"

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel) private readonly PostModel: ModelType<PostModel>,
    @InjectModel(BotPostsModel)
    private readonly BotPosts: ModelType<BotPostsModel>
  ) {}

  async createPost(dto: PostDto) {
    try {
      const post = await this.PostModel.create(dto)
      return await post.save()
    } catch (e) {
      console.log(e)
      throw new Error("Internal Server Error")
    }
  }
  async updatePost(dto: PostDto, postId: number) {
    const post = await this.PostModel.findOneAndUpdate(
      { id: postId },
      dto
    ).exec()
    if (!post) {
      throw new NotFoundException(`Post width id: ${postId} notFound`)
    }
    return post
  }
  async deletePost(postId: number) {
    const post = await this.PostModel.findOneAndDelete({ id: postId }).exec()
    if (!post) {
      throw new NotFoundException(`Post width id: ${postId} notFound`)
    }
    return post
  }
  async applyPost(postId: number) {
    const post = await this.PostModel.findOneAndUpdate(
      { id: postId },
      { status: "accepted" }
    ).exec()

    if (!post) {
      throw new NotFoundException(`Post width id: ${postId} notFound`)
    }

    return post
  }
  async rejectPost(postId: number) {
    const post = await this.PostModel.findOneAndUpdate(
      { id: postId },
      { status: "rejected" }
    ).exec()
    if (!post) {
      throw new NotFoundException(`Post width id: ${postId} notFound`)
    }
    return post
  }

  async getPosts(query: string) {
    if (query) {
      const posts = await this.BotPosts.find().exec()
      const fuse = new Fuse(posts, {
        keys: [
          "image_url",
          "first_name",
          "last_name",
          "email",
          "phone",
          "address",
          "username",
          "sex",
          "coordinates.lat",
          "coordinates.lng"
        ],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 1
      })
      console.log(posts)
      return fuse.search(query)
    } else {
      return this.BotPosts.find().exec()
    }
  }
  async getPost(id: number) {
    return await this.BotPosts.findOne({ id }).exec()
  }
}
