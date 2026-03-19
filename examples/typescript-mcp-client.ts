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
      to: ["recipient@example.com"],
      subject: "Hello from my AI agent",
      body_text: "This email was sent by an AI agent using Xobni.",
    },
  });
  console.log("\nSend result:", sendResult.content);

  // Semantic search
  const searchResult = await client.callTool({
    name: "search_emails",
    arguments: { query: "meeting notes from last week" },
  });
  console.log("\nSearch results:", searchResult.content);

  // Calendar: create an event
  const event = await client.callTool({
    name: "create_calendar_event",
    arguments: {
      title: "Team Standup",
      start_time: "2026-03-20T10:00:00",
      end_time: "2026-03-20T10:30:00",
      timezone: "America/New_York",
      recurrence_rule: "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    },
  });
  console.log("\nCreated event:", event.content);

  // Calendar: list events
  const events = await client.callTool({
    name: "list_calendar_events",
    arguments: { limit: 5 },
  });
  console.log("\nCalendar events:", events.content);

  // Storage: store a document
  const doc = await client.callTool({
    name: "store_document",
    arguments: {
      collection: "notes",
      data: { title: "Meeting Notes", content: "Discussed Q2 roadmap..." },
      metadata: { type: "meeting" },
    },
  });
  console.log("\nStored document:", doc.content);

  // Storage: RAG query
  const answer = await client.callTool({
    name: "ask_storage",
    arguments: { question: "What was discussed about the roadmap?" },
  });
  console.log("\nRAG answer:", answer.content);

  // Schedule an email
  const scheduled = await client.callTool({
    name: "schedule_email",
    arguments: {
      send_at: "2026-03-20T09:00:00Z",
      to: ["recipient@example.com"],
      subject: "Reminder",
      body_text: "Don't forget the meeting today!",
    },
  });
  console.log("\nScheduled email:", scheduled.content);

  await client.close();
}

main().catch(console.error);
