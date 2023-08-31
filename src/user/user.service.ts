import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { TypeRole } from "../auth/auth.interface"
import { GroupModel } from "./user.model"
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    @InjectModel(GroupModel) private readonly GroupModel: ModelType<GroupModel>
  ) {}
  async findUserByQuery(query: string) {
    return await this.UserModel.find({
      $or: [{ username: query }, { firstName: query }, { lastName: query }]
    }).exec()
  }
  async getUsers(page: number = 1, perPage: number = 10) {
    const skipAmount = (page - 1) * perPage
    return await this.UserModel.find()
      .skip(skipAmount)
      .limit(perPage)
      .lean()
      .exec()
  }
  async deleteUserById(id: number) {
    return await this.UserModel.findOneAndDelete({ id: id }).exec()
  }
  async changeRole(role: TypeRole, id: number) {
    return await this.UserModel.findOneAndUpdate(
      { id: id },
      { isAdmin: role }
    ).exec()
  }
  // async changeGroup(groupId: number, userId: number) {
  //   const group = await this.GroupModel.findById(groupId).exec()
  //   if (!group) {
  //     throw new BadRequestException(`Group with ID ${groupId} not found`)
  //   }
  //
  //   const user = await this.UserModel.findOne({ id: userId })
  //   if (!user) {
  //     throw new BadRequestException(`User with ID ${userId} not found`)
  //   }
  //
  //   group.members.push(user.id)
  //   await group.save()
  //   return group
  // }
  // async applyToJoinGroup() {}
}
