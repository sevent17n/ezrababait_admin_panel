import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TypeRole } from "../auth/auth.interface"

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
  @prop({ default: "housekeeper" })
  isAdmin: TypeRole
  @prop()
  posts: Post[]
  @prop()
  chats: Chat[]
  @prop()
  groupId: number
}
export class Post {
  @prop()
  age: number
  @prop()
  name: string
  @prop()
  bio: string
  @prop()
  schedule: string
  @prop()
  scope: string
  @prop()
  area: string
  @prop()
  distance: string
  @prop()
  experience: string
}
export class Message {
  @prop()
  content: string
  @prop()
  date: Date
}
export class Chat {
  @prop()
  messages: Message[]
}
