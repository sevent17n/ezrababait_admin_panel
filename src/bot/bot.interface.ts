import { Scenes, Context as BaseContext } from "telegraf"

export interface Context extends BaseContext {
  session: SessionData
  scene: Scenes.SceneContextScene<Context, MySceneSession>
  match: any
}

interface SessionData extends Scenes.SceneSession<MySceneSession> {
  messageId: number
  user: {
    id?: number
    name?: string
    email?: string
    phone?: string
  }
  message: {
    text: string
  }
}
interface MySceneSession extends Scenes.SceneSessionData {
  callbackQuery: {
    data: string
  }
  session: {
    user: {
      name: string
    }

    state: {
      step: number
      prevScene?: string[]
    }
  }
}
