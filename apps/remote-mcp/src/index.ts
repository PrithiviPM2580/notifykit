import { Hono } from "hono";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { sendTelegramMessage, telegramMessageInputSchema } from "notifykit-core";

function createServer(botToken: string) {
  const server = new McpServer({
    name: "notifykit-remote-mcp",
    version: "0.0.0",
  });

  server.registerTool(
    "telegram",
    {
      title: "Telegram",
      description: "Send a Telegram message.",
      inputSchema: telegramMessageInputSchema.shape,
    },
    async (input) => {
      const result = await sendTelegramMessage({
        ...input,
        botToken,
      });

      return {
        content: [
          {
            type: "text",
            text: `Sent Telegram message ${result.messageId} to chat ${result.chatId}`,
          },
        ],
        structuredContent: result,
      };
    },
  );

  return server;
}

const app = new Hono();

app.post("/:botToken/mcp", async (c) => {
  const botToken = c.req.param("botToken");
  const server = createServer(botToken);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    return await transport.handleRequest(c.req.raw);
  } catch (error) {
    console.error("Error handling request:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  } finally {
    await server.close();
  }
});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

const PORT = process.env.PORT || 3000;

export default {
  port: PORT,
  fetch: app.fetch,
};
