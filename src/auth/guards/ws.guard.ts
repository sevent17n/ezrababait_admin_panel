import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "../../user/user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"

@Injectable()
export class WsAuthOnlyUserGuard implements CanActivate {
  constructor(
    @InjectModel(UserModel)
    private readonly User: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient()

    const token = client.handshake.auth.bearer.split(" ")[1]
    if (token) {
      const result = await this.jwtService.verifyAsync(token)

      const user = await this.User.findOne({ id: result.id })
      if (!user) {
        throw new ForbiddenException("Unauthorized access")
      }

      return true
    } else {
      throw new UnauthorizedException("No token")
    }
  }
}

@Injectable()
export class WsAuthOnlyAdminGuard implements CanActivate {
  constructor(
    @InjectModel(UserModel)
    private readonly User: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient()

    const token = client.handshake.auth.bearer.split(" ")[1]
    if (token) {
      const result = await this.jwtService.verifyAsync(token)

      const user = await this.User.findOne({ id: result.id })

      if (!(user.isAdmin === "admin" || user.isAdmin === "super_admin")) {
        throw new UnauthorizedException("U have no rights")
      }

      return true
    } else {
      throw new UnauthorizedException("No token")
    }
  }
}

@Injectable()
export class WsAuthOnlySuperAdminGuard implements CanActivate {
  constructor(
    @InjectModel(UserModel)
    private readonly User: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient()

    const token = client.handshake.auth.bearer.split(" ")[1]
    if (token) {
      const result = await this.jwtService.verifyAsync(token)

      const user = await this.User.findOne({ id: result.id })

      if (user.isAdmin !== "super_admin") {
        throw new UnauthorizedException("U have no rights")
      }

      return true
    } else {
      throw new UnauthorizedException("No token")
    }
  }
}
