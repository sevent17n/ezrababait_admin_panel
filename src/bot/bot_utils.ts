import * as crypto from "crypto"

export const createHash = (userid: string, first_name: string) => {
  const dataCheckString = `first_name=${first_name}/userid=${userid}`
  const { BOT_TOKEN } = process.env
  console.log(dataCheckString)
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest()
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex")
  console.log(hmac)
  return hmac
}
