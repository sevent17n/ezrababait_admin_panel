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
import { Request } from "express"
import { ChangeRoleDto } from "./dto/changeRole.dto"

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
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("change_role")
  async changeRole(@Body() dto: ChangeRoleDto, @Req() request: Request) {
    return this.UserService.changeRole(dto, request)
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
