import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { TelegramLoginDto } from "./dto/auth.dto"
import { RefreshTokenDto } from "./dto/refreshToken.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("telegram")
  async telegramLogin(@Body() dto: TelegramLoginDto) {
    return this.AuthService.telegramLogin(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto)
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("verify")
  async verifyLogin(
    @Query("checkString") checkString: string,
    @Query("hash") hash: string
  ) {
    return this.AuthService.verifyLogin(checkString, hash)
  }
}
