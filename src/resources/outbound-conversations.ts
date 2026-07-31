import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  OutboundConversation,
  StartOutboundChatConversationParams,
  StartOutboundEmailConversationParams,
  StartOutboundPhoneConversationParams,
} from "../models/conversations.js";

/**
 * Outbound conversation endpoints, where the AI agent proactively initiates
 * contact with a customer following an outbound procedure. Requires an
 * Integration API key.
 *
 * The customer is created, or matched to an existing record, from `customer_id`
 * and any `customer_support_platform_identifiers` supplied.
 */
export class OutboundConversations {
  constructor(private readonly http: HttpClient) {}

  /**
   * Creates and starts an outbound live chat conversation. Pass `body` to send
   * a specific opening message, otherwise the AI agent writes one.
   */
  startChat(
    params: StartOutboundChatConversationParams,
    config: RequestConfig = {},
  ): Promise<OutboundConversation> {
    return this.http.request("POST", "outbound/conversations/chat", {
      body: params,
      signal: config.signal,
    });
  }

  /**
   * Creates and starts an outbound email conversation. Pass `subject` and
   * `body` together to send a specific opening email, otherwise the AI agent
   * writes one.
   */
  startEmail(
    params: StartOutboundEmailConversationParams,
    config: RequestConfig = {},
  ): Promise<OutboundConversation> {
    return this.http.request("POST", "outbound/conversations/email", {
      body: params,
      signal: config.signal,
    });
  }

  /**
   * Places an outbound phone call. `from_phone_number` must be a number already
   * provisioned for your company.
   */
  startPhone(
    params: StartOutboundPhoneConversationParams,
    config: RequestConfig = {},
  ): Promise<OutboundConversation> {
    return this.http.request("POST", "outbound/conversations/phone", {
      body: params,
      signal: config.signal,
    });
  }
}
