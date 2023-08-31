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

  async changeGroup(groupId: number, userId: number) {
    const group = await this.GroupModel.findById(groupId).exec()
    if (!group) {
      throw new BadRequestException(`Group with ID ${groupId} not found`)
    }

    const user = await this.UserModel.findOne({ id: userId })
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`)
    }

    group.members.push(user.id)
    await group.save()
    return group
  }
  async applyToJoinGroup() {}
}
