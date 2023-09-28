import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UserModel } from "../user/user.model"
import { GroupModel } from "./group.model"
import axios from "axios"
import { CreateGroupDto } from "./dto/create_group.dto"
import { BotPostsModel } from "../bot/bot_posts.model"

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    @InjectModel(GroupModel) private readonly GroupModel: ModelType<GroupModel>,
    @InjectModel(BotPostsModel)
    private readonly BotPosts: ModelType<BotPostsModel>
  ) {}
  async findGroupByName(name: string) {
    return await this.GroupModel.find({ name: name }).exec()
  }
  async getGroups(page: number = 1, perPage: number = 20) {
    try {
      const skipAmount = (page - 1) * perPage
      return await this.GroupModel.find()
        .skip(skipAmount)
        .limit(perPage)
        .lean()
        .exec()
    } catch (e) {
      console.log(e)
      throw new Error("Internal Server Error")
    }
  }
  async getGroupById(_id: string) {
    const group = await this.GroupModel.findOne({ _id: _id }).exec()

    if (!group)
      throw new BadRequestException(`Group width id: ${_id} not found`)
    return group
  }
  async createGroup(dto: CreateGroupDto) {
    try {
      const users = await this.BotPosts.find({
        id: { $in: dto.idArray }
      })

      // const { data } = await axios.post(
      //   `https://api.telegram.org/bot${process.env.BOT_TOKEN}/method/messages.createChat`,
      //   {
      //     users: dto.idArray,
      //     title: dto.name
      //   }
      // )
      // console.log(data)
      return await this.GroupModel.create({
        name: dto.name,
        image_url: dto.image_url,
        members: users
      })
    } catch (e) {
      console.log(e)
      throw new Error("Internal Server Error")
    }
  }
  async deleteGroup(id: number) {
    const group = await this.GroupModel.deleteOne({ id: id }).exec()
    if (!group) throw new BadRequestException(`Group width id: ${id} not found`)
    return group
  }
  async addAdminToGroup(username: string, groupId: string) {
    const admin = await this.UserModel.findOne({ username: username }).exec()
    if (!admin)
      throw new BadRequestException(`Admin with username ${username} not found`)
    const group = await this.GroupModel.findOne({ _id: groupId }).exec()
    if (!group)
      throw new BadRequestException(`Admin with id ${groupId} not found`)
    if (group.admin) {
      throw new BadRequestException("It can not be more than one admin")
    }
    group.admin = admin
    admin.groupId = String(group._id)
    await group.save()
    await admin.save()
    return { group, admin }
  }
  async addUserToGroup(username: string, groupId: string) {
    const group = await this.GroupModel.findById(groupId).exec()
    if (!group) {
      throw new BadRequestException(`Group with ID ${groupId} not found`)
    }

    const user = await this.UserModel.findOne({ username })
    if (!user) {
      throw new BadRequestException(`User with ID ${username} not found`)
    }
    user.groupId = group.id
    await user.save()
    // group.members.push(user)
    await group.save()
    return group
  }
}
