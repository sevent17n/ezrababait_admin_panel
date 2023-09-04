import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { TypeRole } from "../auth/auth.interface"
import { Request } from "express"

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
      throw new Error("Internal Server Error")
    }
  }
  async deleteUserById(id: number) {
    const user = await this.UserModel.findOneAndDelete({ id: id }).exec()
    if (!user) throw new BadRequestException(`User with id: ${id} not found`)
    return user
  }
  async changeRole(role: TypeRole, id: number, request: Request) {
    if (role === "pending")
      throw new BadRequestException("Role can not be pending")

    const authenticatedUser = request.user as UserModel
    const UserRole = authenticatedUser.isAdmin

    if (UserRole !== "admin" && role === "super_admin")
      throw new BadRequestException("You have no rights")

    const user = await this.UserModel.findOneAndUpdate(
      { id: id },
      { isAdmin: role }
    ).exec()

    if (!user) throw new BadRequestException(`User with id: ${id} not found`)
    return user
  }
  async getPendingUsers(page: number = 1, perPage: number = 20) {
    try {
      const skipAmount = (page - 1) * perPage
      return await this.UserModel.find({ isAdmin: "pending" })
        .skip(skipAmount)
        .limit(perPage)
        .lean()
        .exec()
    } catch (e) {
      throw new Error("Internal Server Error")
    }
  }
}
