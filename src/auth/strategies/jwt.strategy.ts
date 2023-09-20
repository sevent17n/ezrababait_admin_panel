import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "../../user/user.model"
import { Injectable } from "@nestjs/common"
import { ModelType } from "@typegoose/typegoose/lib/types"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UserModel)
    private readonly UserModel: ModelType<UserModel>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET")
    })
  }
  async validate({ id }: Pick<UserModel, "id">) {
    return await this.UserModel.findOne({ id }).exec()
  }
}
