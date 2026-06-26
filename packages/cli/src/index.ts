import { Command } from "commander";
import { sendTelegramMessage } from "notifykit-core";

const program = new Command();

program
  .name("notifykit")
  .description("NotifyKit CLI")
  .command("telegram")
  .description("Send a message to Telegram")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.error(
        "Error: TELEGRAM_BOT_TOKEN environment variable is not set.",
      );
      process.exit(1);
    }

    if (!chatId) {
      console.error("Missing Telegram chat ID.");
      process.exit(1);
    }

    if (!message) {
      console.error("Missing Telegram message.");
      process.exit(1);
    }

    try {
      const result = await sendTelegramMessage({
        botToken: token,
        chatId,
        message,
      });

      console.log(`Sent Telegram message to chat ${result.chatId}`);
      console.log(`Telegram message ID: ${result.messageId}`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error(`Telegram API request failed: ${detail}`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
