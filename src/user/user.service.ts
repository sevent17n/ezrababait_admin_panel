import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { TypeRole } from "../auth/auth.interface"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}
  async findUserByQuery(query: string) {
    const user = await this.UserModel.find({
      $or: [{ username: query }, { firstName: query }, { lastName: query }]
    }).exec()
    if (!user)
      throw new BadRequestException(`Users by query: ${query} not found`)
  }
  async getUsers(page: number = 1, perPage: number = 20) {
    try {
      const skipAmount = (page - 1) * perPage
      return await this.UserModel.find()
        .skip(skipAmount)
        .limit(perPage)
        .lean()
        .exec()
    } catch (e) {
      console.log(e)
      throw new Error("Internal Server Error")
    }
  }
  async deleteUserById(id: number) {
    const user = await this.UserModel.findOneAndDelete({ id: id }).exec()
    if (!user) throw new BadRequestException(`User with id: ${id} not found`)
    return user
  }
  async changeRole(role: TypeRole, id: number) {
    const user = await this.UserModel.findOneAndUpdate(
      { id: id },
      { isAdmin: role }
    ).exec()
    if (!user) throw new BadRequestException(`User with id: ${id} not found`)
    return user
  }
}
