import { Markup } from "telegraf"

export const registrationButton = () =>
  Markup.inlineKeyboard([
    Markup.button.callback("Register as housekeeper", "register_housekeeper")
  ])
export const menuButton = () => {
  const { WEB_APP_URL } = process.env
  return Markup.inlineKeyboard([
    [
      { text: "Register as housekeeper", callback_data: "register_housekeeper" }
    ],
    [{ text: "Check requests ", web_app: { url: WEB_APP_URL } }]
  ])
}
export const ConfirmRegistrationButton = () => {
  const buttons = [
    [
      {
        text: `Yes`,
        callback_data: "confirm_registration"
      },
      {
        text: `No`,
        callback_data: "register_housekeeper"
      }
    ]
  ]
  return { inline_keyboard: buttons }
}

export const SexButton = () =>
  Markup.inlineKeyboard([
    Markup.button.callback("Male", "male"),
    Markup.button.callback("Female", "female")
  ])
