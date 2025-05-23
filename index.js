import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import fs from "fs";
import { Api } from "telegram";

const apiId = 14797328; // replace with your actual api_id
const apiHash = "7c1a7af11a78400fb8e522ca17196b78"; // replace with your actual api_hash
const stringSession = new StringSession(fs.readFileSync("anon.session", "utf-8"));

const sourceGroupId = BigInt("-1002568140829");
const targetGroupId = BigInt("-1002578841900");
const botUsername = "a16478293_bot";

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  await client.start({
    phoneNumber: async () => await input.text("Number?"),
    password: async () => await input.text("2FA Password?"),
    phoneCode: async () => await input.text("Code?"),
    onError: (err) => console.log(err),
  });

  console.log("Client started. Listening for messages...");

  const botEntity = await client.getEntity(botUsername);

  client.addEventHandler(async (event) => {
    const message = event.message;

    if (
      message.chatId === sourceGroupId &&
      message.senderId &&
      message.senderId.value === botEntity.id
    ) {
      try {
        await client.sendMessage(targetGroupId, {
          message: message.message,
          parseMode: "html",
        });
        console.log("Message copied.");
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  }, new client.constructor.events.NewMessage({ chats: [sourceGroupId] }));
})();
