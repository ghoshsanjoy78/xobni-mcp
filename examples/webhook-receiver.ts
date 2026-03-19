/**
 * Example: Webhook receiver for Xobni events.
 *
 * Verifies HMAC-SHA256 signatures and processes webhook events.
 *
 * Supported events:
 *   - email.received, email.sent
 *   - calendar.event_reminder
 *   - scheduled_email.sent, scheduled_email.failed
 *   - document.created
 *
 * Prerequisites:
 *   npm install express
 *
 * Usage:
 *   export WEBHOOK_SECRET="your_webhook_signing_secret"
 *   npx tsx webhook-receiver.ts
 */

import express from "express";
import crypto from "crypto";

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

app.use(express.json());

function verifySignature(payload: string, timestamp: string, signature: string): boolean {
  const message = `${timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(message).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-xobni-signature"] as string;
  const timestamp = req.headers["x-xobni-timestamp"] as string;

  if (!signature || !timestamp) {
    return res.status(401).json({ error: "Missing signature headers" });
  }

  const payload = JSON.stringify(req.body);
  if (!verifySignature(payload, timestamp, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Check for replay attacks (timestamp older than 5 minutes)
  const age = Date.now() / 1000 - parseInt(timestamp);
  if (age > 300) {
    return res.status(401).json({ error: "Timestamp too old" });
  }

  const { event, agent_id } = req.body;
  console.log(`Received ${event} for agent ${agent_id}`);

  // Handle email events
  if (event === "email.received" || event === "email.sent") {
    const { email } = req.body;
    console.log(`  From: ${email.from_address}`);
    console.log(`  Subject: ${email.subject}`);
    console.log(`  Snippet: ${email.snippet}`);
    console.log(`  Trusted: ${email.is_trusted_sender}`);
    console.log(`  Attachments: ${email.attachment_count}`);
  }

  // Handle calendar reminders
  if (event === "calendar.event_reminder") {
    const { calendar_event } = req.body;
    console.log(`  Event: ${calendar_event.title}`);
    console.log(`  Starts: ${calendar_event.start_time}`);
  }

  // Handle scheduled email events
  if (event === "scheduled_email.sent" || event === "scheduled_email.failed") {
    const { scheduled_email } = req.body;
    console.log(`  Scheduled ID: ${scheduled_email.id}`);
    console.log(`  Status: ${scheduled_email.status}`);
  }

  // Handle document events
  if (event === "document.created") {
    const { document } = req.body;
    console.log(`  Collection: ${document.collection}`);
    console.log(`  Document ID: ${document.id}`);
  }

  // Process the event...
  // Use the email.id with the REST API or MCP to get the full email body if needed.

  res.json({ received: true });
});

app.listen(3000, () => {
  console.log("Webhook receiver listening on port 3000");
});
