import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION || "");

const sourceGroupId = BigInt("-1002568140829");
const targetGroupId = BigInt("-1002578841900");
const monitoredBotUsername = "a16478293_bot";

(async () => {
  const client = new TelegramClient({
    apiId,
    apiHash,
    session: stringSession,
  });

  await client.login({
    phoneNumber: async () => process.env.PHONE || await input.text("Phone: "),
    password: async () => process.env.PASSWORD || await input.text("2FA Password (if any): "),
    phoneCode: async () => await input.text("Telegram code: "),
    onError: (err) => console.error(err),
  });

  console.log("Logged in!");
  console.log("STRING_SESSION (save this):", client.session.save());

  client.addEventHandler(async (event) => {
    const message = event.message;
    const sender = await message.getSender();

    if (message.chatId === sourceGroupId && sender?.username === monitoredBotUsername) {
      if (message.message) {
        await client.sendMessage(targetGroupId, { message: message.message });
        console.log("Copied message:", message.message);
      }
    }
  }, "NewMessage");

  // Keep the bot running
  await client.run();
})();
