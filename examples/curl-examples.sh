#!/bin/bash
# Xobni REST API - cURL Examples
#
# Set your API key:
#   export XOBNI_API_KEY="xobni_your_key_here"

BASE_URL="https://api.xobni.ai/api/v1"
AUTH="Authorization: Bearer $XOBNI_API_KEY"

# ─── Agent Info ───────────────────────────────────────────────

echo "=== Get Agent Info ==="
curl -s -H "$AUTH" "$BASE_URL/agents" | jq .

# ─── Inbox ────────────────────────────────────────────────────

echo "=== Read Inbox ==="
curl -s -H "$AUTH" "$BASE_URL/emails?limit=10" | jq .

# ─── Read Email ───────────────────────────────────────────────

echo "=== Read Email ==="
curl -s -H "$AUTH" "$BASE_URL/emails/EMAIL_ID" | jq .

# ─── Send Email ───────────────────────────────────────────────

echo "=== Send Email ==="
curl -s -X POST "$BASE_URL/emails/send" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient@example.com"],
    "subject": "Hello from my AI agent",
    "body_text": "This email was sent by an AI agent using Xobni."
  }' | jq .

# ─── Send Email with Attachment ───────────────────────────────

echo "=== Send Email with Attachment ==="
curl -s -X POST "$BASE_URL/emails/send" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient@example.com"],
    "subject": "Report attached",
    "body_text": "Please find the report attached.",
    "attachments": [
      {
        "filename": "report.pdf",
        "content_type": "application/pdf",
        "data": "BASE64_ENCODED_FILE_CONTENT"
      }
    ]
  }' | jq .

# ─── Semantic Search ──────────────────────────────────────────

echo "=== Search Emails ==="
curl -s -X POST "$BASE_URL/search" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "meeting notes from last week",
    "limit": 5
  }' | jq .

# ─── Threads ──────────────────────────────────────────────────

echo "=== Get Thread ==="
curl -s -H "$AUTH" "$BASE_URL/emails/threads/THREAD_ID" | jq .

# ─── Webhooks ─────────────────────────────────────────────────

echo "=== Create Webhook ==="
curl -s -X POST "$BASE_URL/event-hooks" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["email.received", "email.sent"]
  }' | jq .

echo "=== List Webhooks ==="
curl -s -H "$AUTH" "$BASE_URL/event-hooks" | jq .

# ─── Storage ──────────────────────────────────────────────────

echo "=== Store Document ==="
curl -s -X POST "$BASE_URL/store/notes/documents" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"title": "Meeting Notes", "content": "Discussed Q2 roadmap..."},
    "metadata": {"type": "meeting", "date": "2026-03-09"}
  }' | jq .

echo "=== Search Storage ==="
curl -s -X POST "$BASE_URL/store/search" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Q2 roadmap discussion",
    "limit": 5
  }' | jq .

echo "=== Ask Storage (RAG) ==="
curl -s -X POST "$BASE_URL/store/ask" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What was decided about the Q2 roadmap?"
  }' | jq .

# ─── Trusted Senders ─────────────────────────────────────────

echo "=== List Trusted Senders ==="
curl -s -H "$AUTH" "$BASE_URL/trusted-senders" | jq .

echo "=== Add Trusted Sender ==="
curl -s -X POST "$BASE_URL/trusted-senders" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "partner@company.com",
    "name": "Partner Contact"
  }' | jq .
