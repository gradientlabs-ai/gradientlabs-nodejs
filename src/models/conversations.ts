import type { Attachment } from "./common.js";
import type { Channel, ConversationEventType, CustomerSource, ParticipantType } from "./enums.js";

/** Agent-derived metadata about how a conversation was processed. */
export interface AgentMetadata {
  intent: string;
  intent_handoff_target: string;
  handoff_reason: string;
  handoff_note: string;
}

/** A series of messages between a customer, human agent, and the AI agent. */
export interface Conversation {
  id: string;
  customer_id: string;
  channel: Channel;
  created: string;
  updated: string;
  status: string;
  /** Whether an AI agent is currently actively handling this conversation. */
  agent_is_active: boolean;
  latest_intent: string;
  latest_handoff_target: string;
  latest_agent_metadata?: AgentMetadata;
}

/** A single message within a conversation. */
export interface Message {
  id: string;
  body: string;
  participant_id: string;
  participant_type: ParticipantType;
  subject?: string;
  attachments?: Attachment[];
  created?: string;
  conversation_token?: string;
}

export interface StartConversationParams {
  /** Unique external identifier for the conversation. */
  id: string;
  /** Unique external identifier for the customer. */
  customer_id: string;
  channel: Channel;
  /** Optional identifier of the participant the conversation is assigned to. */
  assignee_id?: string;
  /** Set to "AI Agent" to assign the conversation to the Gradient Labs AI. */
  assignee_type?: ParticipantType;
  /** Arbitrary metadata attached to the conversation; echoed back in webhooks. */
  metadata?: unknown;
  /** Optional creation timestamp (RFC3339). Defaults to now. */
  created?: string;
  /** Structured context data the AI agent can use, keyed by resource type. */
  resources?: Record<string, unknown>;
  /** Optional traffic group to scope which procedures the conversation can access. */
  traffic_group_id?: string;
  /** Raw sensitive token echoed back in future tool/webhook calls. */
  conversation_token?: string;
}

export interface AddMessageParams {
  id: string;
  body?: string;
  participant_id: string;
  participant_type: ParticipantType;
  subject?: string;
  attachments?: Attachment[];
  created?: string;
  conversation_token?: string;
}

export interface AssignConversationParams {
  assignee_type: ParticipantType;
  assignee_id?: string;
  reason?: string;
  timestamp?: string;
}

export interface ResumeConversationParams {
  assignee_type: ParticipantType;
  resources: Record<string, unknown>;
  assignee_id?: string;
  reason?: string;
  timestamp?: string;
}

export interface CancelConversationParams {
  reason?: string;
  timestamp?: string;
}

export interface FinishConversationParams {
  reason?: string;
  timestamp?: string;
}

export interface ConversationEventParams {
  type: ConversationEventType;
  participant_id: string;
  participant_type: ParticipantType;
  body?: string;
  message_id?: string;
  idempotency_key?: string;
  timestamp?: string;
}

export interface RateConversationParams {
  type: string;
  value: number;
  max_value: number;
  min_value: number;
  comments?: string;
  timestamp?: string;
}

export interface ReturnAsyncToolResultParams {
  async_tool_execution_id: string;
  payload?: Record<string, unknown>;
  timestamp?: string;
}

export interface ReadConversationParams {
  /** Which platform's conversation to read. Defaults to "public-api". */
  support_platform?: string;
}

export interface StartOutboundConversationParams {
  customer_id: string;
  customer_source: CustomerSource;
  procedure_id: string;
  channel?: Channel;
  support_platform?: string;
  body?: string;
  subject?: string;
  resources?: Record<string, unknown>;
}

export interface OutboundConversation {
  conversation_id: string;
}
