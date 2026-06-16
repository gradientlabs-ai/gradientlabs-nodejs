import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  OutboundConversation,
  StartOutboundConversationParams,
} from "../models/conversations.js";

/**
 * Outbound conversation endpoints. Requires an Integration API key.
 */
export class OutboundConversations {
  constructor(private readonly http: HttpClient) {}

  /** Creates and starts a new outbound conversation initiated by the AI agent. */
  start(
    params: StartOutboundConversationParams,
    config: RequestConfig = {},
  ): Promise<OutboundConversation> {
    return this.http.request("POST", "outbound/conversations", {
      body: params,
      signal: config.signal,
    });
  }
}
