import { IsArray, IsNumber, IsString } from "class-validator"

export class CreateGroupDto {
  @IsString()
  name: string
  @IsString()
  image_url: string
  @IsArray()
  @IsNumber({}, { each: true })
  idArray: Array<number>
}
