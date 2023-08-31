import { TypeRole } from "../auth.interface"
import { JwtAuthGuard } from "../guards/jwt.guard"
import { OnlyAdminGuard, OnlySuperAdminGuard } from "../guards/admin.guard"
import { applyDecorators, UseGuards } from "@nestjs/common"

export const Auth = (role: TypeRole = "housekeeper") => {
  if (role === "admin") {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard))
  } else if (role === "super_admin") {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlySuperAdminGuard))
  } else {
    applyDecorators(UseGuards(JwtAuthGuard))
  }
}
