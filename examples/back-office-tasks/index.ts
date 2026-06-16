/**
 * Back-office tasks example: creates a back-office task and reads its status.
 * Requires an Integration API key and a configured back-office agent.
 *
 * In your own project: import { GradientLabs } from "@gradient-labs/client";
 */
import { GradientLabs } from "../../src/index.js";

const apiKey = process.env.GRADIENT_LABS_API_KEY;
if (!apiKey) {
  throw new Error("GRADIENT_LABS_API_KEY environment variable is required");
}

const agentId = process.env.GL_BACK_OFFICE_AGENT_ID ?? "";
if (!agentId) {
  throw new Error("GL_BACK_OFFICE_AGENT_ID environment variable is required");
}

const client = new GradientLabs({ apiKey });

async function main(): Promise<void> {
  const id = `example-task-${Date.now()}`;

  const task = await client.backOfficeTasks.create({
    id,
    agent_id: agentId,
    input: { order_id: "order-123", reason: "refund_request" },
    metadata: { source: "nodejs-example" },
  });
  console.log("Created back-office task:", task.id, "status:", task.status ?? "(pending)");

  const fetched = await client.backOfficeTasks.get(id);
  console.log("Read task, status:", fetched.status ?? "(pending)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
