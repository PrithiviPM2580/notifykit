import { Command } from "commander";

const program = new Command();

program
  .name("notifykit")
  .description("NotifyKit CLI")
  .command("telegram")
  .description("Send a message to Telegram")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    console.log("chatId", chatId);
    console.log("message", message);
    process.exit(1);
  });

program.parseAsync(process.argv);
