import { IsDate, IsNumber, IsObject, ValidateNested } from "class-validator"
import { ContentType } from "../chat.model"
import { Type } from "class-transformer"

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

export class CreateMessageDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ContentType)
  content: ContentType
  @IsNumber()
  senderId: number
  @IsNumber()
  chatId: string
  @IsDate()
  date: Date
}
