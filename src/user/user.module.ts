import { Module } from "@nestjs/common"
import { TypegooseModule } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ConfigModule } from "@nestjs/config"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { GroupModel } from "../group/group.model"

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
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
