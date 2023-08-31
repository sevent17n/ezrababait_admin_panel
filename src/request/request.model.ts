import { modelOptions, prop, Severity } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { PostModel } from "../post/post.model"

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ApplyPostRequestModel extends TimeStamps {
  post: PostModel
}
