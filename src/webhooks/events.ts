import type { BackOfficeTask } from "../models/back-office-tasks.js";
import type { CustomerSource } from "../models/enums.js";

/** The set of webhook event types currently delivered by Gradient Labs. */
export const WebhookType = {
  AgentMessage: "agent.message",
  ConversationHandOff: "conversation.hand_off",
  ConversationFinished: "conversation.finished",
  ActionExecute: "action.execute",
  ResourcePull: "resource.pull",
  BackOfficeTaskComplete: "back-office-task.complete",
  BackOfficeTaskHandOff: "back-office-task.hand-off",
  BackOfficeTaskFail: "back-office-task.fail",
} as const;
export type WebhookType = (typeof WebhookType)[keyof typeof WebhookType];

/**
 * The conversation an `agent.message`, `conversation.hand_off`, or
 * `conversation.finished` event relates to.
 */
export interface WebhookConversation {
  id: string;
  customer_id: string;
}

/**
 * The conversation an `action.execute` or `resource.pull` event relates to.
 * Present only when the action ran in a conversation context.
 */
export interface ActionWebhookConversation {
  id: string;
  customer_id: string;
  customer_source: CustomerSource;
  /** Metadata attached to the conversation when it was started. */
  metadata: unknown;
}

/**
 * The back-office task an `action.execute` or `resource.pull` event relates to.
 * Present only when the action ran in a back-office task context.
 */
export interface ActionWebhookBackOfficeTask {
  id: string;
}

export interface AgentMessageEvent {
  conversation: WebhookConversation;
  body: string;
  total?: number;
  sequence?: number;
  intent?: string;
  /** Whether this is a holding response sent while the agent works. */
  is_holding?: boolean;
  /** External ID of the customer message this turn is responding to. */
  last_customer_message_id?: string;
}

export interface ConversationHandOffEvent {
  conversation: WebhookConversation;
  target?: string;
  /** Coded reason the agent wants to hand off. */
  reason_code: string;
  /** Human-legible description of the reason code. */
  reason: string;
  note?: string;
  intent?: string;
}

export interface ConversationFinishedEvent {
  conversation: WebhookConversation;
  reason_code?: string;
  intent?: string;
}

export interface ActionExecuteEvent {
  action: string;
  /** Arguments to execute the action with. */
  params: unknown;
  /** Set when the action ran in a conversation context. */
  conversation?: ActionWebhookConversation;
  /** Set when the action ran in a back-office task context. */
  back_office_task?: ActionWebhookBackOfficeTask;
}

export interface ResourcePullEvent {
  resource_type: string;
  /** Set when the pull ran in a conversation context. */
  conversation?: ActionWebhookConversation;
  /** Set when the pull ran in a back-office task context. */
  back_office_task?: ActionWebhookBackOfficeTask;
}

/**
 * The three back-office task events all carry the full task under a single
 * `back_office_task` key. The outcome (result / failure reasons / hand-off
 * reason) lives inside that task object.
 */
export interface BackOfficeTaskCompleteEvent {
  back_office_task: BackOfficeTask;
}

export interface BackOfficeTaskHandOffEvent {
  back_office_task: BackOfficeTask;
}

export interface BackOfficeTaskFailEvent {
  back_office_task: BackOfficeTask;
}

/** Fields common to every webhook envelope. */
interface WebhookBase {
  id: string;
  sequence_number: number;
  /** RFC3339 timestamp of when the event was generated. */
  timestamp: string;
}

/**
 * A parsed, verified webhook event. Discriminate on `type` for exhaustive,
 * type-safe handling of the `data` payload.
 */
export type WebhookEvent =
  | (WebhookBase & { type: "agent.message"; data: AgentMessageEvent })
  | (WebhookBase & { type: "conversation.hand_off"; data: ConversationHandOffEvent })
  | (WebhookBase & { type: "conversation.finished"; data: ConversationFinishedEvent })
  | (WebhookBase & { type: "action.execute"; data: ActionExecuteEvent })
  | (WebhookBase & { type: "resource.pull"; data: ResourcePullEvent })
  | (WebhookBase & { type: "back-office-task.complete"; data: BackOfficeTaskCompleteEvent })
  | (WebhookBase & { type: "back-office-task.hand-off"; data: BackOfficeTaskHandOffEvent })
  | (WebhookBase & { type: "back-office-task.fail"; data: BackOfficeTaskFailEvent });

/** The result of parsing a webhook request. */
export interface ParsedWebhook {
  event: WebhookEvent;
  /**
   * The optional sensitive conversation token from the `X-GradientLabs-Token`
   * header, if present.
   */
  token?: string;
}
