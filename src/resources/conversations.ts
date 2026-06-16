import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  AddMessageParams,
  AssignConversationParams,
  CancelConversationParams,
  Conversation,
  ConversationEventParams,
  FinishConversationParams,
  Message,
  ReadConversationParams,
  RateConversationParams,
  ResumeConversationParams,
  ReturnAsyncToolResultParams,
  StartConversationParams,
} from "../models/conversations.js";

/**
 * Conversation endpoints. Requires an Integration API key.
 */
export class Conversations {
  constructor(private readonly http: HttpClient) {}

  /** Begins a conversation. */
  start(params: StartConversationParams, config: RequestConfig = {}): Promise<Conversation> {
    return this.http.request("POST", "conversations", { body: params, signal: config.signal });
  }

  /** Retrieves a conversation, including the latest AI agent metadata. */
  get(
    id: string,
    params: ReadConversationParams = {},
    config: RequestConfig = {},
  ): Promise<Conversation> {
    return this.http.request("GET", `conversations/${encodeURIComponent(id)}/read`, {
      query: { support_platform: params.support_platform },
      signal: config.signal,
    });
  }

  /**
   * Retrieves a conversation.
   *
   * @deprecated Use {@link Conversations.get} instead, which reads from the
   * canonical `/read` endpoint.
   */
  getDeprecated(id: string, config: RequestConfig = {}): Promise<Conversation> {
    return this.http.request("GET", `conversations/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Adds a new message to an existing conversation. */
  addMessage(id: string, params: AddMessageParams, config: RequestConfig = {}): Promise<Message> {
    return this.http.request("POST", `conversations/${encodeURIComponent(id)}/messages`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Transfers responsibility for handling a conversation to a participant. */
  assign(id: string, params: AssignConversationParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("PUT", `conversations/${encodeURIComponent(id)}/assignee`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Logs an event against the conversation (e.g. typing, delivered, read). */
  addEvent(id: string, params: ConversationEventParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("POST", `conversations/${encodeURIComponent(id)}/events`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Adds the result of a customer survey (e.g. CSAT) to a conversation. */
  rate(id: string, params: RateConversationParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("PUT", `conversations/${encodeURIComponent(id)}/rate`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Cancels a conversation (e.g. because a human has taken it over). */
  cancel(
    id: string,
    params: CancelConversationParams = {},
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request("PUT", `conversations/${encodeURIComponent(id)}/cancel`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Finishes a conversation that has reached a natural end state. */
  finish(
    id: string,
    params: FinishConversationParams = {},
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request("PUT", `conversations/${encodeURIComponent(id)}/finish`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Re-opens a conversation that was previously finished. */
  resume(id: string, params: ResumeConversationParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("PUT", `conversations/${encodeURIComponent(id)}/resume`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Returns the result of an async tool execution. */
  returnAsyncToolResult(
    id: string,
    params: ReturnAsyncToolResultParams,
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request(
      "PUT",
      `conversations/${encodeURIComponent(id)}/return-async-tool-result`,
      { body: params, signal: config.signal },
    );
  }
}
