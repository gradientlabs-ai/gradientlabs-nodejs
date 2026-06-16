import type {
  AttributeCardinality,
  AttributeType,
  ResourceSourceRefreshStrategy,
  ResourceSourceScope,
  ResourceSourceType,
  ResourceTypeRefreshStrategy,
  ResourceTypeScope,
  SchemaUpdateStrategy,
} from "./enums.js";

/** A single data field within a resource schema. */
export interface Attribute {
  path: string;
  type: AttributeType;
  cardinality: AttributeCardinality;
  description: string;
  is_root: boolean;
  name: string;
}

/** The structure of data provided by a resource source or type. */
export interface Schema {
  /** The complete JSON schema definition in its original format. */
  raw: Record<string, unknown>;
  attributes?: Attribute[];
}

/** HTTP body configuration for a resource source. */
export interface ResourceSourceHttpBodyDefinition {
  encoding: string;
  json_template?: string;
  form_field_templates?: Record<string, string>;
}

/** HTTP configuration for a resource source. */
export interface ResourceSourceHttpConfig {
  method: string;
  url_template: string;
  header_templates?: Record<string, string>;
  body?: ResourceSourceHttpBodyDefinition;
}

/** Webhook configuration for a resource source. */
export interface ResourceSourceWebhookConfig {
  name: string;
}

/** A data source that provides structured information to AI agents. */
export interface ResourceSource {
  id: string;
  display_name: string;
  description: string;
  source_type: ResourceSourceType;
  available_refresh_strategies: ResourceSourceRefreshStrategy[];
  available_scopes: ResourceSourceScope[];
  created: string;
  updated: string;
  attribute_descriptions?: Record<string, string>;
  schema?: Schema;
  http_config?: ResourceSourceHttpConfig;
  webhook_config?: ResourceSourceWebhookConfig;
}

export interface CreateResourceSourceParams {
  display_name: string;
  source_type: ResourceSourceType;
  description?: string;
  attribute_descriptions?: Record<string, string>;
  http_config?: ResourceSourceHttpConfig;
  webhook_config?: ResourceSourceWebhookConfig;
}

export interface UpdateResourceSourceParams {
  display_name?: string;
  description?: string;
  source_type?: ResourceSourceType;
  attribute_descriptions?: Record<string, string>;
  schema?: Schema;
  http_config?: ResourceSourceHttpConfig;
  webhook_config?: ResourceSourceWebhookConfig;
}

export interface UpdateSchemaByExamplesParams {
  /** Resource payload examples to infer the schema from. */
  examples: Record<string, unknown>[];
  schema_update_strategy?: SchemaUpdateStrategy;
}

/** How a resource type connects to and retrieves data from a source. */
export interface SourceConfig {
  source_id: string;
  /** Which attributes to include. Empty means all. */
  attributes: string[];
  /** Cache duration, e.g. "1h", "30m", "never". */
  cache: string;
}

/** A specific type of structured data accessible by AI agents. */
export interface ResourceType {
  id: string;
  display_name: string;
  description: string;
  scope: ResourceTypeScope;
  refresh_strategy: ResourceTypeRefreshStrategy;
  is_enabled: boolean;
  created: string;
  updated: string;
  schema?: Schema;
  source_config?: SourceConfig;
}

export interface CreateResourceTypeParams {
  display_name: string;
  scope: ResourceTypeScope;
  refresh_strategy: ResourceTypeRefreshStrategy;
  description?: string;
  is_enabled?: boolean;
  source_config?: SourceConfig;
}

export interface UpdateResourceTypeParams {
  display_name?: string;
  description?: string;
  scope?: ResourceTypeScope;
  refresh_strategy?: ResourceTypeRefreshStrategy;
  is_enabled?: boolean;
  source_config?: SourceConfig;
}
