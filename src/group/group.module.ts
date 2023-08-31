import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { UserModel } from "../user/user.model"
import { GroupModel } from "./group.model"
import { ConfigModule } from "@nestjs/config"
import { GroupService } from "./group.service"
import { GroupController } from "./group.controller"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "User"
        }
      },
      {
        typegooseClass: GroupModel,
        schemaOptions: {
          collection: "Group"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
