import {
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from "@nestjs/common"
import { UserModel } from "../../user/user.model"

export class OnlyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>()
    const user = request.user
    if (user.isAdmin === "housekeeper") {
      throw new ForbiddenException("You have no rights")
    }
    return true
  }
}

export class OnlySuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>()
    const user = request.user
    if (user.isAdmin === "admin" || user.isAdmin === "housekeeper") {
      throw new ForbiddenException("You have no rights")
    }
    return true
  }
}
