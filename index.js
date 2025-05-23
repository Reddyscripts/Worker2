import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

// Your API credentials
const apiId = 14797328;
const apiHash = "7c1a7af11a78400fb8e522ca17196b78";

// Session file generated from Python step
const sessionFile = "anon.session";

// IDs of your groups (replace with your real groups)
const sourceGroupId = BigInt(-1002568140829);  // Group where bot sends messages
const targetGroupId = BigInt(-1002578841900);  // Group to copy messages into

async function main() {
  const client = new TelegramClient(sessionFile, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start();
  console.log("Userbot started.");

  client.addEventHandler(async (event) => {
    try {
      const message = event.message;
      const sender = await event.getSender();

      if (sender?.username === "a16478293_bot" && event.chatId === sourceGroupId) {
        await client.sendMessage(targetGroupId, {
          message: message.text || "",
        });
        console.log("Copied message without forward tag.");
      }
    } catch (e) {
      console.error("Error handling message:", e);
    }
  });

  await client.runUntilDisconnected();
}

main();
