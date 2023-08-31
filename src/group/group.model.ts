import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { UserModel } from "../user/user.model"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GroupModel extends TimeStamps {
  @prop()
  adminId: UserModel
  @prop()
  members: Array<UserModel>
}
