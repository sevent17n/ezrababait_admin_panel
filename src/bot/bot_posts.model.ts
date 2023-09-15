import { prop } from "@typegoose/typegoose"

export interface BotPostsModel {
  id: number
  age: number
  image_url: string
  first_name: string
  last_name: string
  email: string
  phone: string
  sex: "male" | "female"
  address: string
  username: string
  coordinates: { lat: number; lng: number }
}
export class BotPostsModel {
  @prop()
  id: number
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
