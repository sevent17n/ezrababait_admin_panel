import { IsString, IsNumber, IsOptional } from "class-validator"

export class TelegramLoginDto {
  @IsNumber()
  id: number
  @IsOptional()
  @IsString()
  first_name: string
  @IsOptional()
  @IsString()
  last_name: string
  @IsOptional()
  @IsString()
  username: string
  @IsOptional()
  @IsString()
  hash: string
  @IsOptional()
  @IsNumber()
  auth_date: number
  @IsOptional()
  @IsString()
  photo_url: string
}
