import { Controller } from "@nestjs/common"

import { ChatService } from "./chat.service"

@Controller("posts")
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}
}
