import { IsString, IsNumber } from "class-validator"

export class TelegramLoginDto {
  @IsNumber()
  id: number
  @IsString()
  first_name: string
  @IsString()
  last_name: string
  @IsString()
  username: string
  @IsString()
  hash: string
  @IsNumber()
  auth_date: number
  @IsString()
  photo_url: string
}
