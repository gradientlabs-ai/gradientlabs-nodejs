import type { BodyEncoding, ParameterSource, ParameterType } from "./enums.js";

/** Request body configuration for an HTTP tool. */
export interface HttpBodyDefinition {
  encoding: BodyEncoding;
  /** JSON body template when encoding is "application/json". */
  json_template?: string;
  /** Form fields when encoding is form-encoded. */
  form_field_templates?: Record<string, string>;
}

/** Configures a tool to make direct HTTP requests to external APIs. */
export interface HttpDefinition {
  method: string;
  /** URL with `${params.name}` substitution. */
  url_template: string;
  header_templates?: Record<string, string>;
  body?: HttpBodyDefinition;
}

/** Configures a tool to call a webhook. */
export interface ToolWebhookConfiguration {
  name: string;
}

/** Configures a tool to execute via a Temporal workflow. */
export interface WorkflowConfiguration {
  workflow_type: string;
  task_queue: string;
}

/** Configures a tool to execute via a Model Context Protocol server. */
export interface McpConfiguration {
  server_id: string;
  external_tool_name: string;
}

/** A tool configuration embedded within another tool (e.g. async start/cancel). */
export interface ChildTool {
  http?: HttpDefinition;
  webhook?: ToolWebhookConfiguration;
  workflow?: WorkflowConfiguration;
}

/**
 * Configures a tool for long-running asynchronous operations.
 *
 * `timeout` is a duration in nanoseconds (the API's native representation).
 */
export interface AsyncDefinition {
  start_execution_tool: ChildTool;
  /** Maximum duration to wait, in nanoseconds. */
  timeout: number;
  cancel_execution_tool?: ChildTool;
}

/** A predefined choice for a tool parameter. */
export interface ParameterOption {
  value: string;
  text: string;
}

/** An input parameter a tool accepts when invoked. */
export interface ToolParameter {
  name: string;
  description: string;
  type: ParameterType;
  allowed_sources: ParameterSource[];
  /** If nil, defaults to true (required). */
  required?: boolean;
  options?: ParameterOption[];
}

/** A group of parameters that become active for a discriminator value. */
export interface ToolParameterSet {
  discriminator_parameter_name: string;
  discriminator_value: string;
  parameters: ToolParameter[];
}

/** A custom tool the AI agent can use during conversations. */
export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  parameter_sets?: ToolParameterSet[];
  draft?: boolean;
  http?: HttpDefinition;
  webhook?: ToolWebhookConfiguration;
  async?: AsyncDefinition;
  mcp?: McpConfiguration;
}

export interface CreateToolParams {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  parameter_sets?: ToolParameterSet[];
  draft?: boolean;
  http?: HttpDefinition;
  webhook?: ToolWebhookConfiguration;
  async?: AsyncDefinition;
  mcp?: McpConfiguration;
}

export interface UpdateToolParams {
  description: string;
  parameters: ToolParameter[];
  http?: HttpDefinition;
  webhook?: ToolWebhookConfiguration;
  async?: AsyncDefinition;
}

export interface ReadToolParams {
  /** Read a specific tool version. */
  version?: number;
}

/** A name/value argument passed to a tool execution. */
export interface ToolArgument {
  name: string;
  value: string;
}

export interface ExecuteToolParams {
  arguments: ToolArgument[];
  /** Optional conversation-scoped token, if the tool requires one. */
  token?: string;
}

export interface ToolExecutionResult {
  id: string;
  /** JSON result of the execution, if it succeeded. */
  result?: Record<string, unknown>;
  /** Error that occurred during execution, if it failed. */
  error?: string;
}
