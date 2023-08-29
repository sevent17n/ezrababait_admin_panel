import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "nestjs-typegoose"
import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { AuthDto } from "./dto/auth.dto"
import { UserModel } from "../user/user.model"
import { RefreshTokenDto } from "./dto/refreshToken.dto"
import { compare, genSalt, hash } from "bcryptjs"
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: AuthDto) {
    // const user = await this.validateUser(dto)
    // const tokens = await this.issueTokenPair(String(user.id))
    // return {
    //   user: this.returnUserFields(user),
    //   ...tokens
    // }
  }
  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({ email: dto.email })
    if (oldUser) {
      throw new BadRequestException("This email is already taken")
    }
    const salt = await genSalt()
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt)
    })
    await newUser.save()
    const tokens = await this.issueTokenPair(String(newUser._id))
    return {
      user: this.returnUserFields(newUser),
      ...tokens
    }
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId }
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
      _id: user._id,
      first_name: user.first_name,
      profileImageURL: user.profileImageURL,
      isAdmin: user.isAdmin
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
    const user = await this.UserModel.findById(result._id)
    const tokens = await this.issueTokenPair(String(user.id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
}
