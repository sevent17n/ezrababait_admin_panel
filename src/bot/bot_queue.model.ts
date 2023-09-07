import { prop } from "@typegoose/typegoose"

class Post {
  @prop()
  age: number
  @prop()
  image_url: string
  @prop()
  first_name: string
  @prop()
  last_name: string
  @prop()
  email: string
  @prop()
  phone: string
  @prop()
  sex: "male" | "female"
  @prop()
  address: string
  @prop()
  profile_url: string
  @prop()
  username: string
}
export class BotQueueModel {
  @prop({ maxlength: 3, default: [] })
  posts: Array<Post>
}
