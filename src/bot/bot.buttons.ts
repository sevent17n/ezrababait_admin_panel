import { Markup } from "telegraf"

export const registrationButton = () =>
  Markup.inlineKeyboard([
    Markup.button.callback("Register as housekeeper", "register_housekeeper")
  ])
export const ConfirmRegistrationButton = () =>
  Markup.inlineKeyboard([
    Markup.button.callback("Yes", "confirm_registration"),
    Markup.button.callback("No", "register_housekeeper")
  ])
