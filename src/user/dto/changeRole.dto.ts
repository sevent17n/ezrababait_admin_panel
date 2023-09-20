import { IsIn, IsString } from "class-validator"
import { TypeRole } from "../../auth/auth.interface"

export class ChangeRoleDto {
  @IsString()
  @IsIn(["super_admin", "admin", "housekeeper"])
  role: TypeRole
  @IsString()
  username: string
}
