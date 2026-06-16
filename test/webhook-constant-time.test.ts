import { describe, expect, it, vi } from "vitest";

// Assert that signature comparison goes through crypto.timingSafeEqual (a
// constant-time comparison), not a plain string/buffer equality check.
const { timingSafeEqualSpy } = vi.hoisted(() => ({ timingSafeEqualSpy: vi.fn() }));

vi.mock("node:crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:crypto")>();
  return {
    ...actual,
    timingSafeEqual: (a: NodeJS.ArrayBufferView, b: NodeJS.ArrayBufferView) => {
      timingSafeEqualSpy();
      return actual.timingSafeEqual(a, b);
    },
  };
});

const { createHmac } = await import("node:crypto");
const { WebhookVerifier } = await import("../src/index.js");

describe("constant-time comparison", () => {
  it("uses crypto.timingSafeEqual to compare signatures", () => {
    const key = "whsec_key";
    const body = JSON.stringify({
      id: "evt",
      type: "agent.message",
      sequence_number: 1,
      timestamp: "2026-01-01T00:00:00Z",
      data: { conversation: { id: "c", customer_id: "u", metadata: null }, body: "hi" },
    });
    const ts = 1_700_000_000;
    const sig = createHmac("sha256", key).update(`${ts}.`).update(body).digest("hex");

    const verifier = new WebhookVerifier({ signingKey: key, now: () => ts * 1000 });
    verifier.verify({ body, signature: `t=${ts},v1=${sig}` });

    expect(timingSafeEqualSpy).toHaveBeenCalled();
  });
});
