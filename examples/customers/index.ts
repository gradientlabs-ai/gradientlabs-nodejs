/**
 * Customers example: batch-creates a set of memories for a customer for the
 * agent to search over on demand. The call is asynchronous and returns no body;
 * it throws an ApiError with status 409 if a batch is already being created for
 * the same customer.
 *
 * In your own project, import from the published package:
 *   import { GradientLabs } from "@gradientlabs/client";
 */
import { GradientLabs } from "../../src/index.js";

const apiKey = process.env.GRADIENT_LABS_API_KEY;
if (!apiKey) {
  throw new Error("GRADIENT_LABS_API_KEY environment variable is required");
}

const client = new GradientLabs({
  apiKey,
  baseUrl: process.env.GRADIENT_LABS_BASE_URL,
});

async function main(): Promise<void> {
  const customerId = "customer-123";

  await client.customers.batchCreateMemories(customerId, {
    memories: [
      {
        external_id: "order_A-1001",
        custom_type: "order",
        created_at: "2026-07-01T10:00:00Z",
        data: { order_id: "A-1001", status: "shipped" },
      },
      {
        external_id: "pref_channel",
        created_at: "2026-07-02T10:00:00Z",
        data: { channel: "email" },
      },
    ],
  });
  console.log("Accepted memories batch for customer:", customerId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
