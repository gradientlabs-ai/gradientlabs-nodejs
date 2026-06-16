import { describe, expect, it } from "vitest";

import {
  ApiError,
  ConfigurationError,
  ErrorCode,
  GradientLabs,
  GradientLabsError,
} from "../src/index.js";

describe("errors", () => {
  it("requires an apiKey", () => {
    expect(() => new GradientLabs({ apiKey: "" })).toThrow(ConfigurationError);
  });

  it("exposes typed well-known error codes", () => {
    expect(ErrorCode.NotFound).toBe("not_found");
    expect(ErrorCode.PermissionDenied).toBe("permission_denied");
    expect(ErrorCode.FailedPrecondition).toBe("failed_precondition");
  });

  it("ApiError carries status, code, message, and details", () => {
    const err = new ApiError({
      statusCode: 403,
      code: "permission_denied",
      message: "nope",
      details: { trace_id: "t-1", extra: 5 },
    });
    expect(err).toBeInstanceOf(GradientLabsError);
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("permission_denied");
    expect(err.message).toBe("nope");
    expect(err.details["extra"]).toBe(5);
    expect(err.traceId).toBe("t-1");
  });

  it("ApiError.traceId is undefined when absent", () => {
    const err = new ApiError({ statusCode: 500, code: "internal", message: "boom" });
    expect(err.traceId).toBeUndefined();
  });

  it("ApiError falls back to a status message when message is empty", () => {
    const err = new ApiError({ statusCode: 502, code: "unavailable", message: "" });
    expect(err.message).toContain("502");
  });
});
