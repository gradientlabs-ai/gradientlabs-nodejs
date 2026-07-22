/**
 * Conversations example: starts a conversation, sends a customer message, reads
 * it back, uploads a batch of memories, then finishes it.
 *
 * In your own project, import from the published package:
 *   import { GradientLabs } from "@gradientlabs/client";
 */
import { GradientLabs } from "../../src/index.js";

const apiKey = process.env.GRADIENT_LABS_API_KEY;
if (!apiKey) {
  throw new Error("GRADIENT_LABS_API_KEY environment variable is required");
}

const client = new GradientLabs({ apiKey });

async function main(): Promise<void> {
  const id = `example-${Date.now()}`;

  const conversation = await client.conversations.start({
    id,
    customer_id: "customer-123",
    channel: "web",
    assignee_type: "AI Agent",
    metadata: { source: "nodejs-example" },
  });
  console.log("Started conversation:", conversation.id, conversation.status);

  await client.conversations.addMessage(id, {
    id: `msg-${Date.now()}`,
    body: "Hi, I need help with my order.",
    participant_id: "customer-123",
    participant_type: "Customer",
  });
  console.log("Sent customer message");

  const fetched = await client.conversations.get(id);
  console.log("Read conversation, latest intent:", fetched.latest_intent || "(none yet)");

  const upload = await client.conversations.uploadMemories(id, {
    idempotency_key: `memories-${Date.now()}`,
    memories: [
      { kind: "order", order_id: "A-1001", status: "shipped", occurred_at: "2026-01-01T00:00:00Z" },
      { kind: "preference", channel: "email" },
    ],
    created_at_keys: ["occurred_at"],
  });
  console.log("Uploaded memories:", upload.upload_id, upload.memories_inserted);

  await client.conversations.finish(id, {
    reason: "example complete",
    reason_code: "customer-ended-chat",
  });
  console.log("Finished conversation");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
