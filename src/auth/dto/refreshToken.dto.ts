import { IsString } from "class-validator"

export class RefreshTokenDto {
  @IsString({
    message: "type error"
  })
  refreshToken: string
}
