import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  InvalidWebhookSignatureError,
  UnknownWebhookTypeError,
  WebhookVerifier,
} from "../src/index.js";

const SIGNING_KEY = "whsec_test_key";
const FIXED_NOW = 1_700_000_000_000; // ms
const FIXED_TS = Math.floor(FIXED_NOW / 1000); // s

function sign(body: string, key: string, ts: number): string {
  const sig = createHmac("sha256", key).update(`${ts}.`).update(body).digest("hex");
  return `t=${ts},v1=${sig}`;
}

function newVerifier(overrides: { key?: string; leewayMs?: number } = {}): WebhookVerifier {
  return new WebhookVerifier({
    signingKey: overrides.key ?? SIGNING_KEY,
    leewayMs: overrides.leewayMs,
    now: () => FIXED_NOW,
  });
}

const agentMessageBody = JSON.stringify({
  id: "evt_1",
  type: "agent.message",
  sequence_number: 1,
  timestamp: "2026-01-01T00:00:00Z",
  data: {
    conversation: { id: "conv_1", customer_id: "cust_1", metadata: { foo: "bar" } },
    body: "Hello!",
    is_holding: false,
  },
});

describe("WebhookVerifier.verify", () => {
  it("accepts a valid signature", () => {
    const verifier = newVerifier();
    const signature = sign(agentMessageBody, SIGNING_KEY, FIXED_TS);
    expect(() => verifier.verify({ body: agentMessageBody, signature })).not.toThrow();
  });

  it("rejects a signature made with the wrong key", () => {
    const verifier = newVerifier();
    const signature = sign(agentMessageBody, "whsec_wrong_key", FIXED_TS);
    expect(() => verifier.verify({ body: agentMessageBody, signature })).toThrow(
      InvalidWebhookSignatureError,
    );
  });

  it("rejects a tampered body", () => {
    const verifier = newVerifier();
    const signature = sign(agentMessageBody, SIGNING_KEY, FIXED_TS);
    expect(() => verifier.verify({ body: agentMessageBody + " ", signature })).toThrow(
      InvalidWebhookSignatureError,
    );
  });

  it.each([
    ["empty", ""],
    ["missing t", `v1=${"a".repeat(64)}`],
    ["missing v1", `t=${FIXED_TS}`],
    ["malformed pair", "not-a-pair"],
  ])("rejects a malformed header (%s)", (_name, header) => {
    const verifier = newVerifier();
    expect(() => verifier.verify({ body: agentMessageBody, signature: header })).toThrow(
      InvalidWebhookSignatureError,
    );
  });

  it("rejects a timestamp that is too old", () => {
    const verifier = newVerifier({ leewayMs: 5 * 60 * 1000 });
    const oldTs = FIXED_TS - 10 * 60; // 10 minutes ago
    const signature = sign(agentMessageBody, SIGNING_KEY, oldTs);
    expect(() => verifier.verify({ body: agentMessageBody, signature })).toThrow(
      InvalidWebhookSignatureError,
    );
  });

  it("rejects a timestamp too far in the future", () => {
    const verifier = newVerifier({ leewayMs: 5 * 60 * 1000 });
    const futureTs = FIXED_TS + 10 * 60;
    const signature = sign(agentMessageBody, SIGNING_KEY, futureTs);
    expect(() => verifier.verify({ body: agentMessageBody, signature })).toThrow(
      InvalidWebhookSignatureError,
    );
  });

  it("accepts when one of several v1 signatures matches", () => {
    const verifier = newVerifier();
    const good = createHmac("sha256", SIGNING_KEY)
      .update(`${FIXED_TS}.`)
      .update(agentMessageBody)
      .digest("hex");
    const signature = `t=${FIXED_TS},v1=${"0".repeat(64)},v1=${good}`;
    expect(() => verifier.verify({ body: agentMessageBody, signature })).not.toThrow();
  });
});

describe("WebhookVerifier.parse", () => {
  it("verifies, then returns the typed event and token passthrough", () => {
    const verifier = newVerifier();
    const signature = sign(agentMessageBody, SIGNING_KEY, FIXED_TS);
    const { event, token } = verifier.parse({
      body: agentMessageBody,
      headers: {
        "x-gradientlabs-signature": signature,
        "x-gradientlabs-token": "secret-token",
      },
    });

    expect(token).toBe("secret-token");
    expect(event.type).toBe("agent.message");
    if (event.type === "agent.message") {
      expect(event.data.body).toBe("Hello!");
      expect(event.data.conversation.customer_id).toBe("cust_1");
    }
  });

  it("works with a Fetch-style Headers object", () => {
    const verifier = newVerifier();
    const signature = sign(agentMessageBody, SIGNING_KEY, FIXED_TS);
    const headers = new Headers({ "X-GradientLabs-Signature": signature });
    const { event, token } = verifier.parse({ body: agentMessageBody, headers });
    expect(event.type).toBe("agent.message");
    expect(token).toBeUndefined();
  });

  it("throws UnknownWebhookTypeError for an unrecognised type", () => {
    const verifier = newVerifier();
    const body = JSON.stringify({
      id: "evt_x",
      type: "something.new",
      sequence_number: 1,
      timestamp: "2026-01-01T00:00:00Z",
      data: {},
    });
    const signature = sign(body, SIGNING_KEY, FIXED_TS);
    expect(() =>
      verifier.parse({ body, headers: { "x-gradientlabs-signature": signature } }),
    ).toThrow(UnknownWebhookTypeError);
  });

  const baseTask = {
    id: "t1",
    agent_id: "a1",
    input: { foo: "bar" },
    created: "2026-01-01T00:00:00Z",
  };
  const eventFixtures: Array<[string, unknown]> = [
    ["agent.message", { conversation: { id: "c", customer_id: "u" }, body: "hi" }],
    [
      "conversation.hand_off",
      {
        conversation: { id: "c", customer_id: "u" },
        reason_code: "complex",
        reason: "Too complex",
      },
    ],
    ["conversation.finished", { conversation: { id: "c", customer_id: "u" } }],
    [
      "action.execute",
      {
        action: "create_ticket",
        params: { foo: 1 },
        conversation: { id: "c", customer_id: "u", customer_source: "public-api", metadata: null },
      },
    ],
    [
      "resource.pull",
      {
        resource_type: "order",
        conversation: { id: "c", customer_id: "u", customer_source: "public-api", metadata: null },
      },
    ],
    ["action.execute", { action: "lookup", params: {}, back_office_task: { id: "t1" } }],
    [
      "back-office-task.complete",
      { back_office_task: { ...baseTask, status: "completed", result: { result_type: "custom" } } },
    ],
    [
      "back-office-task.hand-off",
      { back_office_task: { ...baseTask, status: "handed-off", hand_off_reason: "needs human" } },
    ],
    [
      "back-office-task.fail",
      { back_office_task: { ...baseTask, status: "failed", failure_reasons: ["boom"] } },
    ],
  ];

  it.each(eventFixtures)("deserializes a %s event", (type, data) => {
    const verifier = newVerifier();
    const body = JSON.stringify({
      id: "evt",
      type,
      sequence_number: 2,
      timestamp: "2026-01-01T00:00:00Z",
      data,
    });
    const signature = sign(body, SIGNING_KEY, FIXED_TS);
    const { event } = verifier.parse({
      body,
      headers: { "x-gradientlabs-signature": signature },
    });
    expect(event.type).toBe(type);
    expect(event.data).toEqual(data);
  });
});
