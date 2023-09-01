import { IsDate, IsNumber, IsObject } from "class-validator"
import { ContentType } from "../chat.model"

export class ChatDto {
  @IsDate()
  date: Date
  @IsNumber()
  userId: number
  @IsNumber()
  chatId: number
  @IsObject()
  content: ContentType
}
