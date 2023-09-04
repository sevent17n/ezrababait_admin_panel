import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { PostModel } from "./post.model"
import { PostDto } from "./dto/post.dto"

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel) private readonly PostModel: ModelType<PostModel>
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

  async getPosts(query: "rejected" | "accepted" | undefined) {
    if (query === undefined) {
      return await this.PostModel.find().exec()
    } else {
      return await this.PostModel.find({ status: query }).exec()
    }
  }
}
