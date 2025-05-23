import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

// Your API credentials
const apiId = 14797328;
const apiHash = "7c1a7af11a78400fb8e522ca17196b78";

// Empty string because session will load from anon.session file automatically
const stringSession = "";

const sourceGroupId = BigInt("1002568140829");
const targetGroupId = BigInt("1002578841900");
const botUsername = "a16478293_bot";

(async () => {
  const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    // No login prompts needed because session file is used
    onError: (err) => console.error(err),
  });

  console.log("Client started!");

  client.addEventHandler(async (event) => {
    const msg = event.message;
    if (
      msg.peerId?.channelId === sourceGroupId &&
      msg.senderId?.userId &&
      msg.sender?.username === botUsername
    ) {
      // Send message text to target group without forwarding info
      await client.sendMessage(targetGroupId, { message: msg.text || msg.message || "" });
      console.log("Copied message to target group");
    }
  }, new client.events.NewMessage({}));

})();
