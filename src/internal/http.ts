import { ApiError, GradientLabsError, type ErrorCode } from "../errors.js";
import { userAgent } from "./user-agent.js";

/** A subset of the global `fetch` signature, so callers can inject their own. */
export type FetchLike = (
  input: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  },
) => Promise<{
  status: number;
  text(): Promise<string>;
}>;

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  fetch: FetchLike;
  timeoutMs?: number;
}

export interface RequestOptions {
  /** Query parameters. Undefined/null values are omitted. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** JSON request body. Serialised with JSON.stringify. */
  body?: unknown;
  /** Caller-supplied cancellation signal. */
  signal?: AbortSignal;
}

/**
 * Thin wrapper around `fetch` that handles auth, headers, JSON
 * (de)serialisation, cancellation, and error mapping. It never retries — retry
 * policy is left entirely to the caller.
 */
export class HttpClient {
  constructor(private readonly config: HttpClientConfig) {}

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.query);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiKey}`,
      Accept: "application/json",
      "User-Agent": userAgent(),
    };

    let body: string | undefined;
    if (options.body !== undefined) {
      body = JSON.stringify(options.body);
      headers["Content-Type"] = "application/json";
    }

    const signal = this.buildSignal(options.signal);

    let response: { status: number; text(): Promise<string> };
    try {
      response = await this.config.fetch(url, { method, headers, body, signal });
    } catch (cause) {
      throw new GradientLabsError(`request to ${method} ${path} failed: ${errorMessage(cause)}`, {
        cause,
      });
    }

    const rawBody = await response.text();

    if (response.status < 200 || response.status > 299) {
      throw toApiError(response.status, rawBody);
    }

    if (!rawBody) {
      return undefined as T;
    }

    try {
      return JSON.parse(rawBody) as T;
    } catch (cause) {
      throw new GradientLabsError(`failed to parse response body: ${errorMessage(cause)}`, {
        cause,
      });
    }
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined | null>,
  ): string {
    const base = this.config.baseUrl.replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");
    const url = new URL(`${base}/${cleanPath}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private buildSignal(callerSignal?: AbortSignal): AbortSignal | undefined {
    const { timeoutMs } = this.config;
    if (timeoutMs === undefined) {
      return callerSignal;
    }
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    if (!callerSignal) {
      return timeoutSignal;
    }
    // Node 20.3+ has AbortSignal.any; fall back to the caller signal otherwise.
    if (typeof AbortSignal.any === "function") {
      return AbortSignal.any([callerSignal, timeoutSignal]);
    }
    return callerSignal;
  }
}

function toApiError(statusCode: number, rawBody: string): ApiError {
  let code: ErrorCode = "";
  let message = "";
  let details: Record<string, unknown> = {};

  if (rawBody) {
    try {
      const parsed = JSON.parse(rawBody) as {
        code?: string;
        message?: string;
        details?: Record<string, unknown>;
      };
      code = parsed.code ?? "";
      message = parsed.message ?? "";
      details = parsed.details ?? {};
    } catch {
      // Leave defaults; the status code still produces a usable error.
    }
  }

  return new ApiError({ statusCode, code, message, details });
}

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
