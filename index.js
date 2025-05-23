import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input"; // Not used, but required for TelegramClient login
import fs from "fs";

const apiId = 14797328;
const apiHash = "7c1a7af11a78400fb8e522ca17196b78";
const session = new StringSession(fs.readFileSync("anon.session", "utf8"));

const sourceChatId = -1002568140829;
const targetChatId = -1002578841900;
const botUsername = "a16478293_bot";

const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
});

(async () => {
    await client.start();
    console.log("UserBot is up and running...");

    client.addEventHandler(async (event) => {
        const message = event.message;
        if (!message || !message.peerId) return;

        try {
            const fromChat = message.peerId.channelId ? BigInt("-100" + message.peerId.channelId) : null;
            if (fromChat === sourceChatId) {
                const sender = await message.getSender();
                if (sender && sender.username === botUsername.replace("@", "")) {
                    await client.sendMessage(targetChatId, {
                        message: message.message,
                        parseMode: "HTML"
                    });
                    console.log("Message copied.");
                }
            }
        } catch (error) {
            console.error("Error forwarding message:", error);
        }
    });
})();
