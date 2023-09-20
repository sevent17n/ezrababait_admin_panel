import { TelegrafModuleOptions } from "nestjs-telegraf"
import LocalSession from "telegraf-session-local"

const sessions = new LocalSession({ database: "session_db.json" })
export const getTgConfig = async (): Promise<TelegrafModuleOptions> => ({
  middlewares: [sessions.middleware()],
  token: process.env.BOT_TOKEN
})
