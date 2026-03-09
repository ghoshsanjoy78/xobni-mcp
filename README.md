<p align="center">
  <a href="https://xobni.ai">
    <img src="https://www.xobni.ai/xobni-logo.svg" alt="Xobni" width="200" />
  </a>
</p>

<h3 align="center">Email Infrastructure for AI Agents</h3>

<p align="center">
  Give your AI agent a real email address with full inbox management, semantic search, document storage, and calendar — accessible via MCP or REST API.
</p>

<p align="center">
  <a href="https://xobni.ai">Website</a> ·
  <a href="https://www.xobni.ai/docs/getting-started">Docs</a> ·
  <a href="https://www.xobni.ai/docs/mcp">MCP Guide</a> ·
  <a href="https://www.xobni.ai/docs/rest-api">REST API</a> ·
  <a href="https://www.xobni.ai/docs/claude-skill">Claude Skill</a>
</p>

---

## What is Xobni?

Xobni gives AI agents their own `@xobni.ai` email address with a full-featured email platform behind it:

- **Send & receive email** with attachments (PDF, DOCX, XLSX, PPTX)
- **Semantic search** across email bodies and document content
- **Document storage** with RAG (retrieval-augmented generation)
- **Calendar** with event management and natural language search
- **Webhooks** for real-time notifications (email.received, email.sent)
- **Trusted senders** for spam control
- **Scheduled emails** with calendar integration

All accessible via **MCP protocol** or **REST API**, with agent-scoped API keys for security.

## Quick Start

### 1. Create an account

Sign up at [xobni.ai](https://xobni.ai) and create an agent. Each agent gets a unique `@xobni.ai` email address.

### 2. Generate an API key

Go to your agent's settings and create an API key. Keys are scoped to a single agent and start with `xobni_`.

### 3. Connect via MCP

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "xobni-email": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://api.xobni.ai/mcp/",
        "--header",
        "Authorization: Bearer YOUR_API_KEY"
      ]
    }
  }
}
```

#### Claude Code

Add to your MCP settings (`.mcp.json` or via `claude mcp add`):

```json
{
  "mcpServers": {
    "xobni-email": {
      "type": "url",
      "url": "https://api.xobni.ai/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

#### Cursor / Windsurf / Other MCP Clients

Use the streamable HTTP transport:

- **URL:** `https://api.xobni.ai/mcp/`
- **Header:** `Authorization: Bearer YOUR_API_KEY`

## MCP Tools (33)

### Email (10 tools)

| Tool | Description |
|------|-------------|
| `get_agent_info` | Get agent name, email address, slug, description, status, and storage info |
| `read_inbox` | List emails with status, limit, and offset filters |
| `read_email` | Get full email content including headers, body, and attachment list |
| `send_email` | Send email with optional base64 attachments (max 10 files, 10MB total) |
| `get_thread` | Get all emails in a conversation thread |
| `list_attachments` | List attachments for an email |
| `download_attachment` | Get a pre-signed download URL (valid 15 minutes) |
| `mark_email` | Update email status (read/unread/archived) or starred flag |
| `search_emails` | Semantic search across email bodies and extracted document text |
| `get_attachment_text` | Get extracted text from processed document attachments |

### Storage & RAG (8 tools)

| Tool | Description |
|------|-------------|
| `list_collections` | List all document collections with document counts |
| `store_document` | Store a JSON document in a named collection (auto-creates collection) |
| `get_document` | Retrieve a document by ID |
| `query_documents` | List documents with optional metadata JSONB filters |
| `update_document` | Replace document data and metadata, re-generates embeddings |
| `delete_document` | Delete a document and its embeddings |
| `search_storage` | Semantic search across all collections or a specific one |
| `ask_storage` | RAG pipeline — semantic search + LLM-generated answer with citations |

### Webhooks (4 tools)

| Tool | Description |
|------|-------------|
| `list_webhooks` | List webhooks with URL, events, and status |
| `create_webhook` | Create a webhook for `email.received` / `email.sent` events |
| `delete_webhook` | Delete a webhook by ID |
| `list_webhook_deliveries` | List delivery attempts with status codes and timestamps |

### Trusted Senders (3 tools)

| Tool | Description |
|------|-------------|
| `list_trusted_senders` | List allowed senders (agent owner is always trusted) |
| `add_trusted_sender` | Add an email to the trusted senders list |
| `remove_trusted_sender` | Remove a trusted sender |

### Calendar (6 tools)

| Tool | Description |
|------|-------------|
| `list_calendar_events` | List events with date and status filters |
| `create_calendar_event` | Create event with timezone, recurrence, attendees, and metadata |
| `get_calendar_event` | Get a calendar event by ID |
| `update_calendar_event` | Update event fields |
| `delete_calendar_event` | Delete an event |
| `search_calendar` | Search events by natural language |

### Scheduled Emails (3 tools)

| Tool | Description |
|------|-------------|
| `schedule_email` | Schedule an email for future delivery, optional calendar event link |
| `list_scheduled_emails` | List scheduled emails with status filter |
| `cancel_scheduled_email` | Cancel a pending scheduled email |

## REST API

Base URL: `https://api.xobni.ai/api/v1`

Authenticate with `Authorization: Bearer YOUR_API_KEY` header.

See the full [REST API documentation](https://www.xobni.ai/docs/rest-api) for endpoints and examples.

### Key Endpoints

```
GET    /emails                              List emails
GET    /emails/{id}                         Get email details
POST   /emails/send                         Send email
PATCH  /emails/{id}                         Update email status
GET    /emails/threads/{id}                 Get thread
POST   /search                              Semantic search
GET    /agents                              List agents
POST   /store/{collection}/documents        Store document
POST   /store/search                        Search storage
POST   /store/ask                           RAG query
GET    /event-hooks                         List webhooks
POST   /event-hooks                         Create webhook
GET    /trusted-senders                     List trusted senders
POST   /trusted-senders                     Add trusted sender
```

## Claude Skill

Xobni is also available as a [Claude Skill](https://www.xobni.ai/docs/claude-skill) for use with Claude.ai, Claude Code, and the Agent SDK.

Download: [xobni.zip](https://www.xobni.ai/xobni.zip)

## Examples

See the [`examples/`](./examples) directory for:

- [Claude Desktop config](./examples/claude-desktop-config.json)
- [Claude Code config](./examples/claude-code-mcp.json)
- [Python MCP client](./examples/python-mcp-client.py)
- [TypeScript MCP client](./examples/typescript-mcp-client.ts)
- [cURL examples](./examples/curl-examples.sh)
- [Webhook receiver (Express)](./examples/webhook-receiver.ts)

## Security

- **Agent-scoped API keys** — each key is locked to a single agent
- **Trusted senders** — control who can email your agent
- **Webhook signatures** — HMAC-SHA256 verification for webhook payloads
- **Rate limiting** — built-in protection against abuse

## Links

- [Website](https://xobni.ai)
- [Documentation](https://www.xobni.ai/docs/getting-started)
- [MCP Guide](https://www.xobni.ai/docs/mcp)
- [REST API Reference](https://www.xobni.ai/docs/rest-api)
- [Webhook Guide](https://www.xobni.ai/docs/webhooks)
- [Claude Skill](https://www.xobni.ai/docs/claude-skill)

## License

This repository contains documentation and examples for the Xobni platform.
The examples are released under the [MIT License](./LICENSE).
