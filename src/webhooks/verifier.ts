import { createHmac, timingSafeEqual } from "node:crypto";

import { GradientLabsError } from "../errors.js";
import { WebhookType, type ParsedWebhook, type WebhookEvent } from "./events.js";

const SIGNATURE_HEADER = "x-gradientlabs-signature";
const TOKEN_HEADER = "x-gradientlabs-token";
const DEFAULT_LEEWAY_MS = 5 * 60 * 1000;

/** Thrown when a webhook's signature or timestamp cannot be verified. Respond 401. */
export class InvalidWebhookSignatureError extends GradientLabsError {
  constructor(message = "webhook signature is invalid") {
    super(message);
    this.name = "InvalidWebhookSignatureError";
  }
}

/** Thrown when a webhook of an unrecognised type is received. Log it and respond 200. */
export class UnknownWebhookTypeError extends GradientLabsError {
  readonly type: string;
  constructor(type: string) {
    super(`unknown webhook event type received: ${type}`);
    this.name = "UnknownWebhookTypeError";
    this.type = type;
  }
}

/** A source of request headers: a Fetch `Headers`, a Node headers object, or a plain map. */
export type HeadersLike =
  | { get(name: string): string | null }
  | Record<string, string | string[] | undefined>;

/** The raw request body. Signatures are computed over the exact bytes received. */
export type WebhookBody = string | Uint8Array;

export interface WebhookVerifierConfig {
  /** The webhook signing key configured for your workspace. */
  signingKey: string;
  /** Maximum accepted age of a webhook, in milliseconds. Defaults to 5 minutes. */
  leewayMs?: number;
  /** Injectable clock for testing. Defaults to Date.now. */
  now?: () => number;
}

/**
 * Verifies the authenticity of requests to your webhook endpoint using the
 * `X-GradientLabs-Signature` header (format `t=<unix_ts>,v1=<hex>`).
 */
export class WebhookVerifier {
  private readonly signingKey: string;
  private readonly leewayMs: number;
  private readonly now: () => number;

  constructor(config: WebhookVerifierConfig) {
    this.signingKey = config.signingKey;
    this.leewayMs = config.leewayMs ?? DEFAULT_LEEWAY_MS;
    this.now = config.now ?? Date.now;
  }

  /**
   * Verifies a webhook's signature and timestamp. Throws
   * {@link InvalidWebhookSignatureError} if verification fails.
   */
  verify(args: { body: WebhookBody; signature: string | null | undefined }): void {
    const body = toBuffer(args.body);
    const { timestamp, signatures } = parseSignatureHeader(args.signature);

    if (Math.abs(this.now() - timestamp * 1000) > this.leewayMs) {
      throw new InvalidWebhookSignatureError("webhook timestamp is outside the allowed leeway");
    }

    const expected = this.computeSignature(timestamp, body);
    for (const candidate of signatures) {
      if (constantTimeEqual(expected, candidate)) {
        return;
      }
    }
    throw new InvalidWebhookSignatureError();
  }

  /**
   * Verifies a webhook request, then parses it into a typed event. Returns the
   * event along with the optional `X-GradientLabs-Token` passthrough.
   *
   * Verification always happens before the event type is inspected.
   */
  parse(args: { body: WebhookBody; headers: HeadersLike }): ParsedWebhook {
    const signature = getHeader(args.headers, SIGNATURE_HEADER);
    this.verify({ body: args.body, signature });

    const text =
      typeof args.body === "string" ? args.body : Buffer.from(args.body).toString("utf8");
    const payload = JSON.parse(text) as {
      id: string;
      type: string;
      sequence_number: number;
      timestamp: string;
      data: unknown;
    };

    if (!isKnownType(payload.type)) {
      throw new UnknownWebhookTypeError(payload.type);
    }

    const event = {
      id: payload.id,
      type: payload.type,
      sequence_number: payload.sequence_number,
      timestamp: payload.timestamp,
      data: payload.data,
    } as WebhookEvent;

    const token = getHeader(args.headers, TOKEN_HEADER) ?? undefined;
    return { event, token };
  }

  private computeSignature(timestamp: number, body: Buffer): Buffer {
    return createHmac("sha256", this.signingKey).update(`${timestamp}.`).update(body).digest();
  }
}

function isKnownType(type: string): type is WebhookEvent["type"] {
  return (Object.values(WebhookType) as string[]).includes(type);
}

function parseSignatureHeader(header: string | null | undefined): {
  timestamp: number;
  signatures: Buffer[];
} {
  if (!header) {
    throw new InvalidWebhookSignatureError("missing signature header");
  }

  let timestamp: number | undefined;
  const signatures: Buffer[] = [];

  for (const pair of header.split(",")) {
    const idx = pair.indexOf("=");
    if (idx === -1) {
      throw new InvalidWebhookSignatureError("malformed signature header");
    }
    const key = pair.slice(0, idx);
    const value = pair.slice(idx + 1);
    if (key === "t") {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed)) {
        throw new InvalidWebhookSignatureError("invalid timestamp component");
      }
      timestamp = parsed;
    } else if (key === "v1") {
      try {
        signatures.push(Buffer.from(value, "hex"));
      } catch {
        throw new InvalidWebhookSignatureError("invalid signature component");
      }
    }
  }

  if (timestamp === undefined) {
    throw new InvalidWebhookSignatureError("signature header contains no timestamp component");
  }
  if (signatures.length === 0) {
    throw new InvalidWebhookSignatureError("signature header contains no v1 signature");
  }

  return { timestamp, signatures };
}

function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

function toBuffer(body: WebhookBody): Buffer {
  return typeof body === "string" ? Buffer.from(body, "utf8") : Buffer.from(body);
}

function getHeader(headers: HeadersLike, name: string): string | null {
  if (typeof (headers as { get?: unknown }).get === "function") {
    return (headers as { get(n: string): string | null }).get(name);
  }
  const record = headers as Record<string, string | string[] | undefined>;
  // Node lower-cases header keys; check the canonical lower-case form plus a
  // case-insensitive fallback.
  const direct = record[name];
  const value = direct ?? findCaseInsensitive(record, name);
  if (value === undefined) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function findCaseInsensitive(
  record: Record<string, string | string[] | undefined>,
  name: string,
): string | string[] | undefined {
  const lower = name.toLowerCase();
  for (const key of Object.keys(record)) {
    if (key.toLowerCase() === lower) {
      return record[key];
    }
  }
  return undefined;
}
