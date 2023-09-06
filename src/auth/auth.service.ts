import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UserModel } from "src/user/user.model"
import { TelegramLoginDto } from "./dto/auth.dto"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenDto } from "./dto/refreshToken.dto"
import * as crypto from "crypto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly User: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}
  verifyTelegramData(
    receivedHash: string,
    botToken: string,
    dto: TelegramLoginDto
  ): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _, ...filteredAuthData } = dto
    const dataCheckArray = Object.entries(filteredAuthData).map(
      ([key, value]) => `${key}=${value}`
    )
    dataCheckArray.sort()
    const dataCheckString = dataCheckArray.join("\n")
    const secretKey = crypto.createHash("sha256").update(botToken).digest()
    const hmac = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex")
    return hmac === receivedHash
  }
  async loginThroughBot(id: number) {
    const oldUser = await this.User.findOne({ id })
    if (!oldUser) {
      const newUser = new this.User({ id })
      await newUser.save()
    }
  }
  async telegramLogin(dto: TelegramLoginDto) {
    const { BOT_TOKEN } = process.env

    const isDataValid = this.verifyTelegramData(dto.hash, BOT_TOKEN, dto)
    if (Date.now() - dto.auth_date * 1000 > 86400 * 1000) {
      throw new BadRequestException("Data is outdated")
    }
    if (!isDataValid) {
      throw new UnauthorizedException("Think you smart, huh?")
    }
    const user = await this.User.findOne({
      id: dto.id
    })
    if (!user) {
      const newUser = new this.User(dto)

      await newUser.save()
      const tokens = await this.issueTokenPair(String(newUser.id))

      return {
        user: this.returnUserFields(user),
        ...tokens
      }
    }
    const tokens = await this.issueTokenPair(String(user.id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "15d"
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "1h"
    })
    return { refreshToken, accessToken }
  }
  returnUserFields(user: UserModel) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      isAdmin: user.isAdmin,
      groupId: user.groupId,
      chats: user.chats,
      posts: user.posts
    }
  }
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }

    const user = await this.User.findOne({ id: result.id })

    const tokens = await this.issueTokenPair(String(user.id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
}
