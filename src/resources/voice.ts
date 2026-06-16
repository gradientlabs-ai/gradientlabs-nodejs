import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type { ReadVoiceCallContextParams, VoiceCallContext } from "../models/voice.js";

/**
 * Voice endpoints. Requires an Integration API key.
 */
export class Voice {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves the most recent call context for a given phone number. Throws an
   * {@link ApiError} with status 404 if there have been no recent call events.
   */
  getLatestCallContext(
    phoneNumber: string,
    params: ReadVoiceCallContextParams = {},
    config: RequestConfig = {},
  ): Promise<VoiceCallContext> {
    return this.http.request(
      "GET",
      `voice/latest-call-context/${encodeURIComponent(phoneNumber)}`,
      {
        query: {
          lookback_seconds: params.lookback_seconds,
          include_large_fields: params.include_large_fields,
        },
        signal: config.signal,
      },
    );
  }
}
