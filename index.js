import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import fs from "fs";
import { Api } from "telegram";

// Replace with your actual values
const apiId = 14797328;
const apiHash = "7c1a7af11a78400fb8e522ca17196b78";
const session = new StringSession(fs.readFileSync("anon.session", "utf8"));

const sourceGroupId = BigInt("-1002568140829");
const targetGroupId = BigInt("-1002578841900");
const botUsername = "a16478293_bot";

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  await client.connect();
  console.log("Client started");

  const botEntity = await client.getEntity(botUsername);

  client.addEventHandler(async (event) => {
    const msg = event.message;

    if (
      msg.chatId === sourceGroupId &&
      msg.senderId &&
      msg.senderId.value === botEntity.id
    ) {
      try {
        await client.sendMessage(targetGroupId, {
          message: msg.message,
        });
        console.log("Forwarded message.");
      } catch (err) {
        console.error("Error forwarding:", err);
      }
    }
  }, new client.constructor.events.NewMessage({ chats: [sourceGroupId] }));
})();
