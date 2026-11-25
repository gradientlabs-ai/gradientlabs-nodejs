/** The customer-defined category of a memory. */
export interface MemoryCustomType {
  name: string;
  description?: string;
}

/** A memory stored for a customer. */
export interface Memory {
  /** The caller's own identifier for this memory. */
  external_id: string;
  custom_type: MemoryCustomType;
  /** RFC3339 timestamp for when the memory occurred. */
  created_at: string;
  /** Arbitrary JSON object stored verbatim as the memory's payload. */
  data: Record<string, unknown>;
}

export interface BatchCreateMemoriesV2Params {
  /** The memories to create for the customer. Must be non-empty. */
  memories: Memory[];
}

/** A memory for the deprecated batch-create endpoint, whose category is a plain name. */
export interface MemoryInputV1 {
  /** The caller's own identifier for this memory. */
  external_id: string;
  /** The name of the customer-defined category. */
  custom_type: string;
  /** RFC3339 timestamp for when the memory occurred. */
  created_at: string;
  /** Arbitrary JSON object stored verbatim as the memory's payload. */
  data: Record<string, unknown>;
}

export interface MemoriesBatchCreateParams {
  /** The memories to create for the customer. Must be non-empty. */
  memories: MemoryInputV1[];
}
