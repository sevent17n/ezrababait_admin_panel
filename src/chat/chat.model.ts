import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { UserModel } from "../user/user.model"

export interface ContentType {}
export class MessageModel {
  @prop()
  content: ContentType
  @prop()
  date: Date
  @prop()
  userId: number
  @prop()
  chatId: number
}
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ChatModel {
  @prop()
  messages: MessageModel[]
  @prop()
  users: UserModel[]
}
