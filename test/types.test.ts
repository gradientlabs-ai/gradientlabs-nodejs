import { describe, expect, it } from "vitest";

import type { Conversation, Page } from "../src/index.js";

describe("type deserialization", () => {
  it("deserializes a Conversation including optional agent metadata", () => {
    const raw = JSON.stringify({
      id: "conv_1",
      customer_id: "cust_1",
      channel: "email",
      created: "2026-01-01T00:00:00Z",
      updated: "2026-01-02T00:00:00Z",
      status: "finished",
      agent_is_active: false,
      latest_intent: "refund",
      latest_handoff_target: "team_billing",
      latest_agent_metadata: {
        intent: "refund",
        intent_handoff_target: "team_billing",
        handoff_reason: "complex_case",
        handoff_note: "customer wants a refund",
      },
    });

    const conv = JSON.parse(raw) as Conversation;

    expect(conv.id).toBe("conv_1");
    expect(conv.channel).toBe("email");
    expect(conv.agent_is_active).toBe(false);
    expect(conv.latest_agent_metadata?.handoff_reason).toBe("complex_case");
  });

  it("treats omitted optional fields as undefined", () => {
    const conv = JSON.parse(
      JSON.stringify({
        id: "conv_2",
        customer_id: "cust_2",
        channel: "web",
        created: "2026-01-01T00:00:00Z",
        updated: "2026-01-01T00:00:00Z",
        status: "active",
        agent_is_active: true,
        latest_intent: "",
        latest_handoff_target: "",
      }),
    ) as Conversation;

    expect(conv.latest_agent_metadata).toBeUndefined();
  });

  it("models a Page with null cursors when there are no further pages", () => {
    const page: Page<string> = { data: ["a", "b"], pageInfo: {} };
    expect(page.pageInfo.next).toBeUndefined();
    expect(page.pageInfo.prev).toBeUndefined();
  });
});
