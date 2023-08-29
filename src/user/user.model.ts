import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { modelOptions, prop, Severity } from "@typegoose/typegoose"

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
  author: "client" | "housekeeper"
}
export class Chat {
  @prop()
  houseKeeper: UserModel
  @prop()
  client: UserModel
  @prop()
  messages: Message[]
}
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserModel extends TimeStamps {
  @prop({ unique: true })
  id: number
  @prop()
  first_name: string
  @prop()
  profileImageURL: string
  @prop({ default: false })
  isAdmin: boolean
  @prop()
  posts: Post[]
  @prop()
  chats: Chat[]
  @prop()
  type: "client" | "housekeeper"
}
