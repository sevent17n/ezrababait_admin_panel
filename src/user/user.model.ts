import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TypeRole } from "../auth/auth.interface"
import { PostModel } from "../post/post.model"
import { ChatModel } from "../chat/chat.model"
import { ObjectId } from "mongoose"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserModel extends TimeStamps {
  @prop({ unique: true })
  id: number
  @prop({ default: "" })
  first_name: string
  @prop({ default: "" })
  last_name: string
  @prop({ default: "" })
  photo_url: string
  @prop({ default: "" })
  username: string
  @prop({ default: "pending" })
  isAdmin: TypeRole
  @prop()
  posts: PostModel[]
  @prop()
  chats: Array<string>
  @prop()
  groupId: string
}
