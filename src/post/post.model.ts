import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class PostModel extends TimeStamps {
  @prop()
  image_url: string
  @prop()
  name: string
  @prop()
  age: number
  @prop()
  work_scope: string
  @prop()
  experience: string
  @prop()
  bio: string
  @prop()
  location: string
  @prop({ default: "pending" })
  status: "pending" | "rejected" | "accepted"
}
