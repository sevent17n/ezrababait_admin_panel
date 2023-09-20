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

@Controller("group")
export class GroupController {
  constructor(private readonly GroupService: GroupService) {}
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("find_group_by_name")
  async findGroupByName(@Query("name") name: string) {
    return this.GroupService.findGroupByName(name)
  }
  @Auth("super_admin")
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
  async getGroupById(@Query("_id") _id: string) {
    return this.GroupService.getGroupById(_id)
  }
  @Auth("super_admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("create_group")
  async createGroup(
    @Query("name") name: string,
    @Query("image_url") image_url: string
  ) {
    return this.GroupService.createGroup(name, image_url)
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
    @Query("username") username: string,
    @Query("groupId") groupId: string
  ) {
    return this.GroupService.addAdminToGroup(username, groupId)
  }
  @Auth("admin")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("add_user_to_group")
  async addUserToGroup(
    @Query("username") username: string,
    @Query("groupId") groupId: string
  ) {
    return this.GroupService.addUserToGroup(username, groupId)
  }
}
