import { TelegramClient } from "telegram"; import { StringSession } from "telegram/sessions/index.js"; import input from "input"; import fs from 'fs';

const apiId = 14797328; const apiHash = "7c1a7af11a78400fb8e522ca17196b78"; const stringSession = new StringSession(fs.readFileSync("anon.session", "utf8"));

const SOURCE_GROUP_ID = -1002568140829; const TARGET_GROUP_ID = -1002578841900; const BOT_USERNAME = "a16478293_bot";

const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5, });

(async () => { console.log("Connecting..."); await client.start(); console.log("Connected as:", await client.getMe());

client.addEventHandler(async (event) => { const message = event.message; if (!message || !message.sender || !message.sender.username) return;

if (
  event.chatId === SOURCE_GROUP_ID &&
  message.sender.username === BOT_USERNAME.replace("@", "")
) {
  try {
    await client.sendMessage(TARGET_GROUP_ID, {
      message: message.message,
    });
    console.log("Copied message:", message.message);
  } catch (err) {
    console.error("Failed to forward message:", err);
  }
}

}, client.events.NewMessage({})); })();

