import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Auth } from "../auth/decorators/auth.decorator"
import { TypeRole } from "../auth/auth.interface"
import { Request } from "express"

@Controller("users")
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("find_user_by_query")
  async findUserByQuery(@Query("query") query: string) {
    return this.UserService.findUserByQuery(query)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get()
  async getUsers(
    @Query("page") page: number,
    @Query("perPage") perPage: number
  ) {
    return this.UserService.getUsers(page, perPage)
  }
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete()
  async deleteUserById(@Query("id") id: number) {
    return this.UserService.deleteUserById(id)
  }
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async changeRole(
    @Body("role") role: TypeRole,
    @Body("id") id: number,
    @Req() request: Request
  ) {
    return this.UserService.changeRole(role, id, request)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("pending_users")
  async getPendingUsers(
    @Query("page") page: number,
    @Query("perPage") perPage: number
  ) {
    return this.UserService.getPendingUsers(page, perPage)
  }
}
