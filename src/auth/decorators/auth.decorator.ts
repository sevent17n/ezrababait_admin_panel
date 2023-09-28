import { TypeRole } from "../auth.interface"
import { JwtAuthGuard } from "../guards/jwt.guard"
import { OnlyAdminGuard, OnlySuperAdminGuard } from "../guards/admin.guard"
import { applyDecorators, UseGuards } from "@nestjs/common"
import {
  WsAuthOnlyAdminGuard,
  WsAuthOnlySuperAdminGuard,
  WsAuthOnlyUserGuard
} from "../guards/ws.guard"

export const Auth = (role: TypeRole = "housekeeper") => {
  if (role === "admin") {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard))
  } else if (role === "super_admin") {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlySuperAdminGuard))
  } else {
    return applyDecorators(UseGuards(JwtAuthGuard))
  }
}

export const WsAuth = (role: TypeRole = "housekeeper") => {
  if (role === "admin") {
    return applyDecorators(UseGuards(WsAuthOnlyAdminGuard))
  } else if (role === "super_admin") {
    return applyDecorators(UseGuards(WsAuthOnlySuperAdminGuard))
  } else {
    return applyDecorators(UseGuards(WsAuthOnlyUserGuard))
  }
}
