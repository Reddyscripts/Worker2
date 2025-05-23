import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION || "");

const sourceGroupId = BigInt("-1001234567890");  // replace with source group ID
const targetGroupId = BigInt("-1009876543210");  // replace with target group ID
const monitoredBotUsername = "some_bot";         // without @

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => process.env.PHONE || await input.text("Phone number: "),
    password: async () => process.env.PASSWORD || await input.text("2FA Password (if set): "),
    phoneCode: async () => await input.text("Enter the code you received: "),
    onError: (err) => console.error(err),
  });

  console.log("Logged in successfully!");
  console.log("STRING_SESSION (save to env):", client.session.save());

  client.addEventHandler(async (event) => {
    const message = event.message;
    const sender = await message.getSender();

    if (message.chatId === sourceGroupId && sender?.username === monitoredBotUsername) {
      if (message.message) {
        await client.sendMessage(targetGroupId, { message: message.message });
      }
    }
  });

  await client.run();
})();
