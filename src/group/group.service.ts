import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UserModel } from "../user/user.model"
import { GroupModel } from "./group.model"

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    @InjectModel(GroupModel) private readonly GroupModel: ModelType<GroupModel>
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
  async getGroupById(id: number) {
    const group = await this.GroupModel.findOne({ id: id }).exec()
    if (!group) throw new BadRequestException(`Group width id: ${id} not found`)
    return group
  }
  async createGroup(name: string) {
    try {
      return await this.GroupModel.create({ name: name })
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
  async addAdminToGroup(adminId: number, groupId: number) {
    const admin = await this.UserModel.findOne({ id: adminId }).exec()
    if (!admin)
      throw new BadRequestException(`Admin with id ${adminId} not found`)
    const group = await this.GroupModel.findOne({ id: groupId }).exec()
    if (!group)
      throw new BadRequestException(`Admin with id ${groupId} not found`)
    if (group.admin) {
      throw new BadRequestException("It can not be more than one admin")
    }
    group.admin = admin
    admin.groupId = group.id
    await group.save()
    await admin.save()
    return { group, admin }
  }
  async addUserToGroup(userId: number, groupId: number) {
    const group = await this.GroupModel.findById(groupId).exec()
    if (!group) {
      throw new BadRequestException(`Group with ID ${groupId} not found`)
    }

    const user = await this.UserModel.findOne({ id: userId })
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`)
    }
    user.groupId = group.id
    await user.save()
    group.members.push(user)
    await group.save()
    return group
  }
}
