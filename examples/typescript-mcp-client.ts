/**
 * Example: Connect to Xobni MCP server using the TypeScript MCP SDK.
 *
 * Prerequisites:
 *   npm install @modelcontextprotocol/sdk
 *
 * Usage:
 *   export XOBNI_API_KEY="xobni_your_key_here"
 *   npx tsx typescript-mcp-client.ts
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const XOBNI_API_KEY = process.env.XOBNI_API_KEY!;
const MCP_URL = "https://api.xobni.ai/mcp/";

async function main() {
  const client = new Client({ name: "xobni-example", version: "1.0.0" });

  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${XOBNI_API_KEY}`,
      },
    },
  });

  await client.connect(transport);

  // List available tools
  const { tools } = await client.listTools();
  console.log(`Available tools: ${tools.length}`);
  tools.forEach((t) => console.log(`  - ${t.name}: ${t.description?.slice(0, 80)}`));

  // Get agent info
  const agentInfo = await client.callTool({ name: "get_agent_info", arguments: {} });
  console.log("\nAgent info:", agentInfo.content);

  // Read inbox
  const inbox = await client.callTool({
    name: "read_inbox",
    arguments: { limit: 5 },
  });
  console.log("\nInbox:", inbox.content);

  // Send an email
  const sendResult = await client.callTool({
    name: "send_email",
    arguments: {
      to: "recipient@example.com",
      subject: "Hello from my AI agent",
      body: "This email was sent by an AI agent using Xobni.",
    },
  });
  console.log("\nSend result:", sendResult.content);

  await client.close();
}

main().catch(console.error);
