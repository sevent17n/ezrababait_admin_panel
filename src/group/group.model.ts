import { modelOptions, mongoose, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { UserModel } from "../user/user.model"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GroupModel extends TimeStamps {
  @prop()
  id: mongoose.Types.ObjectId
  @prop({ unique: true, default: "" })
  name: string
  @prop({ default: {} })
  admin: UserModel
  @prop({ default: [] })
  members: Array<UserModel>
}
