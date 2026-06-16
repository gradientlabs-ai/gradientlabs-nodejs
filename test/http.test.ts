import { describe, expect, it } from "vitest";

import { ApiError, GradientLabs, type FetchLike } from "../src/index.js";

interface RecordedRequest {
  input: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

function fakeFetch(
  response: { status: number; body: string },
  record: RecordedRequest[],
): FetchLike {
  return (input, init) => {
    record.push({ input, method: init.method, headers: init.headers, body: init.body });
    return Promise.resolve({
      status: response.status,
      text: () => Promise.resolve(response.body),
    });
  };
}

const conversationJson = JSON.stringify({
  id: "conv_1",
  customer_id: "cust_1",
  channel: "web",
  created: "2026-01-01T00:00:00Z",
  updated: "2026-01-01T00:00:00Z",
  status: "active",
  agent_is_active: true,
  latest_intent: "",
  latest_handoff_target: "",
});

describe("HttpClient", () => {
  it("sets the Authorization bearer header on every request", async () => {
    const record: RecordedRequest[] = [];
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: fakeFetch({ status: 200, body: conversationJson }, record),
    });

    await client.conversations.get("conv_1");

    expect(record).toHaveLength(1);
    expect(record[0]!.headers["Authorization"]).toBe("Bearer sk_test_123");
  });

  it("sets a User-Agent header in the expected format", async () => {
    const record: RecordedRequest[] = [];
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: fakeFetch({ status: 200, body: conversationJson }, record),
    });

    await client.conversations.get("conv_1");

    expect(record[0]!.headers["User-Agent"]).toMatch(
      /^Gradient-Labs-Node\/\d+\.\d+\.\d+ \(node\/.+\)$/,
    );
  });

  it("sets Accept and Content-Type appropriately", async () => {
    const record: RecordedRequest[] = [];
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: fakeFetch({ status: 200, body: conversationJson }, record),
    });

    await client.conversations.start({
      id: "conv_1",
      customer_id: "cust_1",
      channel: "web",
    });

    expect(record[0]!.headers["Accept"]).toBe("application/json");
    expect(record[0]!.headers["Content-Type"]).toBe("application/json");
    expect(record[0]!.body).toContain('"id":"conv_1"');
  });

  it("respects a custom base URL", async () => {
    const record: RecordedRequest[] = [];
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      baseUrl: "https://example.test/api",
      fetch: fakeFetch({ status: 200, body: conversationJson }, record),
    });

    await client.conversations.get("conv_1");

    expect(record[0]!.input).toBe("https://example.test/api/conversations/conv_1/read");
  });

  it("maps a non-2xx response to an ApiError with status, code, message, and trace id", async () => {
    const record: RecordedRequest[] = [];
    const errorBody = JSON.stringify({
      code: "not_found",
      message: "conversation not found",
      details: { trace_id: "trace-abc" },
    });
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: fakeFetch({ status: 404, body: errorBody }, record),
    });

    await expect(client.conversations.get("missing")).rejects.toMatchObject({
      statusCode: 404,
      code: "not_found",
      message: "conversation not found",
    });

    try {
      await client.conversations.get("missing");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).traceId).toBe("trace-abc");
    }
  });

  it("passes through an AbortSignal", async () => {
    const controller = new AbortController();
    controller.abort();
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: (_input, init) => {
        if (init.signal?.aborted) {
          return Promise.reject(new Error("aborted"));
        }
        return Promise.resolve({ status: 200, text: () => Promise.resolve(conversationJson) });
      },
    });

    await expect(
      client.conversations.get("conv_1", {}, { signal: controller.signal }),
    ).rejects.toThrow();
  });
});
