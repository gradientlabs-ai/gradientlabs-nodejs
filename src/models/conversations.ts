import type { Attachment, CustomerSupportPlatformIdentifier } from "./common.js";
import type { Channel, ConversationEventType, ParticipantType, SupportPlatform } from "./enums.js";

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
  /**
   * Optional identifiers linking the customer to their record(s) in
   * third-party support platforms (e.g. Intercom, Zendesk). Added to the
   * customer alongside customer_id.
   */
  customer_support_platform_identifiers?: CustomerSupportPlatformIdentifier[];
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
  resources?: Record<string, unknown>;
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
  /** Categorises why the conversation finished, e.g. "customer-ended-chat" or "customer-unresponsive". */
  reason_code?: string;
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
  /** Required by the API: the JSON result of the async tool execution. */
  payload: Record<string, unknown>;
  timestamp?: string;
}

export interface ReadConversationParams {
  /** Which platform's conversation to read. Defaults to "public-api". */
  support_platform?: string;
}

/** Fields shared by every outbound conversation start request. */
interface StartOutboundConversationParamsBase {
  /**
   * Your own identifier for the customer, as used in your systems. It is stored
   * as the customer's company customer ID and is echoed back to you in tool and
   * webhook payloads.
   */
  customer_id: string;
  /**
   * ID of the outbound procedure that defines what the AI agent should
   * accomplish. It must be of type "outbound", live (deployed), and enabled for
   * this channel.
   */
  procedure_id: string;
  /**
   * Optional identifiers linking the customer to their record(s) in third-party
   * support platforms (e.g. Intercom, Zendesk, Salesforce). Added to the
   * customer alongside customer_id, and used to match against customers created
   * via those platforms' native integrations.
   */
  customer_support_platform_identifiers?: CustomerSupportPlatformIdentifier[];
  /** Structured context data the AI agent can use, keyed by resource type. */
  resources?: Record<string, unknown>;
}

export interface StartOutboundChatConversationParams extends StartOutboundConversationParamsBase {
  /**
   * The platform the chat is delivered on. It needs an identifier for the
   * customer in `customer_support_platform_identifiers`, unless the customer
   * already carries one from an earlier conversation.
   */
  support_platform: SupportPlatform;
  /**
   * Content of the opening message. If omitted, the AI agent generates one
   * based on the procedure.
   */
  body?: string;
}

/** Opening email content: subject and body must be supplied together, or both omitted. */
type OutboundEmailOpeningMessage =
  | {
      /** Subject line for the opening email. */
      subject: string;
      /** Content of the opening email. */
      body: string;
    }
  | {
      subject?: never;
      body?: never;
    };

export type StartOutboundEmailConversationParams = StartOutboundConversationParamsBase & {
  /**
   * The platform the email is sent from. It needs an identifier for the
   * customer in `customer_support_platform_identifiers`, unless the customer
   * already carries one from an earlier conversation. Zendesk requires type
   * "zendesk_support_user"; Salesforce requires type "salesforce_contact_id".
   */
  support_platform: SupportPlatform;
} & OutboundEmailOpeningMessage;

export interface StartOutboundPhoneConversationParams extends StartOutboundConversationParamsBase {
  /** The customer's phone number to dial, in E.164 format (e.g. "+14155551234"). */
  to_phone_number: string;
  /**
   * The caller ID to place the call from, in E.164 format. Must be a phone
   * number already provisioned for your company.
   */
  from_phone_number: string;
}

export interface OutboundConversation {
  conversation_id: string;
}
