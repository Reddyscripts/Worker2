import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline";

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION || "");

const sourceGroupId = BigInt("-1002568140829");  // Replace with source group ID
const targetGroupId = BigInt("-1002578841900");  // Replace with target group ID
const monitoredBotUsername = "a16478293_bot";         // Replace with bot username (no @)

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => process.env.PHONE || await ask("Phone number: "),
    password: async () => process.env.PASSWORD || await ask("2FA Password (if set): "),
    phoneCode: async () => await ask("Enter the code you received: "),
    onError: (err) => console.error(err),
  });

  console.log("Logged in!");
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
