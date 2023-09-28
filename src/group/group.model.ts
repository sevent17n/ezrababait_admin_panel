import { modelOptions, mongoose, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { UserModel } from "../user/user.model"
import { BotPostsModel } from "../bot/bot_posts.model"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GroupModel extends TimeStamps {
  @prop({ default: "" })
  name: string
  @prop({ default: "/uploads/groups/default.webp" })
  image_url: string
  @prop({ default: null })
  admin: UserModel | null
  @prop({ default: [] })
  members: Array<BotPostsModel>
}
