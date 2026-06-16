import type { BackOfficeTaskResult } from "../models/back-office-tasks.js";

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

/** Details of the conversation a webhook event relates to. */
export interface WebhookConversation {
  id: string;
  customer_id: string;
  /** Metadata attached to the conversation when it was started. */
  metadata: unknown;
}

/** Details of the back-office task a webhook event relates to. */
export interface WebhookBackOfficeTask {
  id: string;
  agent_id: string;
  metadata?: Record<string, string>;
}

export interface AgentMessageEvent {
  conversation: WebhookConversation;
  body: string;
  total?: number;
  sequence?: number;
  intent?: string;
  /** Whether this is a holding response sent while the agent works. */
  is_holding?: boolean;
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
  conversation: WebhookConversation;
}

export interface ResourcePullEvent {
  resource_type: string;
  conversation: WebhookConversation;
}

export interface BackOfficeTaskCompleteEvent {
  task: WebhookBackOfficeTask;
  result?: BackOfficeTaskResult;
}

export interface BackOfficeTaskHandOffEvent {
  task: WebhookBackOfficeTask;
  hand_off_reason?: string;
}

export interface BackOfficeTaskFailEvent {
  task: WebhookBackOfficeTask;
  failure_reasons?: string[];
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
