/**
 * Well-known error codes returned by the Gradient Labs API in the `code` field
 * of an error response. Callers can switch on {@link ApiError.code} rather than
 * comparing message strings.
 *
 * The union is intentionally open (`| (string & {})`) so that a future
 * server-side code never breaks a consumer at compile time.
 */
export const ErrorCode = {
  NotFound: "not_found",
  Unauthenticated: "unauthenticated",
  PermissionDenied: "permission_denied",
  InvalidArgument: "invalid_argument",
  FailedPrecondition: "failed_precondition",
  ResourceExhausted: "resource_exhausted",
  AlreadyExists: "already_exists",
  Unavailable: "unavailable",
  DeadlineExceeded: "deadline_exceeded",
  Internal: "internal",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode] | (string & {});

/**
 * Base class for every error thrown by this client. Catch this to handle any
 * failure originating from the library.
 */
export class GradientLabsError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "GradientLabsError";
  }
}

/**
 * Thrown when the client is misconfigured (e.g. a missing API key). These are
 * raised before any network request is made.
 */
export class ConfigurationError extends GradientLabsError {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

/**
 * Thrown when the API returns a non-2xx response. It carries the HTTP status
 * code along with the parsed error envelope (`code`, `message`, `details`).
 */
export class ApiError extends GradientLabsError {
  /** HTTP status code of the response. */
  readonly statusCode: number;

  /** Machine-readable error code from the response envelope. */
  readonly code: ErrorCode;

  /** Arbitrary structured details returned with the error. */
  readonly details: Record<string, unknown>;

  constructor(args: {
    statusCode: number;
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(args.message || `unexpected response status: ${args.statusCode}`);
    this.name = "ApiError";
    this.statusCode = args.statusCode;
    this.code = args.code;
    this.details = args.details ?? {};
  }

  /**
   * The identifier that can be given to Gradient Labs technical support to
   * investigate an error, if present in the error details.
   */
  get traceId(): string | undefined {
    const traceId = this.details["trace_id"];
    return typeof traceId === "string" ? traceId : undefined;
  }
}
