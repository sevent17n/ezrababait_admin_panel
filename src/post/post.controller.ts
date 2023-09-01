import { Controller } from "@nestjs/common"
import { PostService } from "./post.service"

@Controller("groups")
export class PostController {
  constructor(private readonly PostService: PostService) {}
}
