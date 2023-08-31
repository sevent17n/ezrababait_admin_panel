import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { GroupService } from "./group.service"
import { Auth } from "../auth/decorators/auth.decorator"

@Controller("groups")
export class GroupController {
  constructor(private readonly GroupService: GroupService) {}
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("find_group_by_name")
  async findGroupByName(@Query("name") name: string) {
    return this.GroupService.findGroupByName(name)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get()
  async getGroups(
    @Query("page") page: number,
    @Query("perPage") perPage: number
  ) {
    return this.GroupService.getGroups(page, perPage)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("get_group_by_id")
  async getGroupById(@Query("id") id: number) {
    return this.GroupService.getGroupById(id)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("create_group")
  async createGroup(@Query("name") name: string) {
    return this.GroupService.createGroup(name)
  }
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete("delete_group")
  async deleteGroup(@Query("id") id: number) {
    return this.GroupService.deleteGroup(id)
  }
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("add_admin_to_group")
  async addAdminToGroup(
    @Body("adminId") adminId: number,
    @Body("groupId") groupId: number
  ) {
    return this.GroupService.addAdminToGroup(adminId, groupId)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("add_user_to_group")
  async addUserToGroup(
    @Body("userId") userId: number,
    @Body("groupId") groupId: number
  ) {
    return this.GroupService.addUserToGroup(userId, groupId)
  }
}
