import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { UserModel } from "../user/user.model"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export class ContentType {
  @prop()
  image?: null | string
  @prop()
  video?: null | string
  @prop()
  text?: null | string
  @prop()
  audio?: null | string
}
export class MessageModel extends TimeStamps {
  @prop()
  content: ContentType
  @prop()
  date: Date
  @prop()
  sender: UserModel
  @prop()
  chatId: string
  @prop()
  read: boolean
}
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ChatModel extends TimeStamps {
  @prop()
  messages: MessageModel[]
  @prop()
  users: UserModel[]
  @prop()
  owner_id: number
  @prop()
  group_id: string
}
