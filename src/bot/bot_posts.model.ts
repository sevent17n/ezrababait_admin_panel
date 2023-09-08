import { prop } from "@typegoose/typegoose"

export class BotPostsModel {
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
  username: string
  @prop()
  coordinates: { lat: number; lng: number }
}
