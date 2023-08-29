import { TypeRole } from "../auth.interface"
import { JwtAuthGuard } from "../guards/jwt.guard"
import { OnlyAdminGuard } from "../guards/admin.guard"
import { applyDecorators, UseGuards } from "@nestjs/common"

export const Auth = (role: TypeRole = "user") => {
  return applyDecorators(
    role === "admin"
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard)
  )
}
