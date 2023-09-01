import { IsNumber, IsString } from "class-validator"

export class PostDto {
  @IsString()
  image_url: string
  @IsString()
  name: string
  @IsNumber()
  age: number
  @IsString()
  work_scope: string
  @IsString()
  experience: string
  @IsString()
  bio: string
  @IsString()
  location: string
}
