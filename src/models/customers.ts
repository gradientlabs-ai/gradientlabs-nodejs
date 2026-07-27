export interface Memory {
  /** The caller's own identifier for this memory. */
  external_id: string;
  /** Optional free-form label categorising the memory. */
  custom_type?: string;
  /** RFC3339 timestamp for when the memory occurred. */
  created_at: string;
  /** Arbitrary JSON object stored verbatim as the memory's payload. */
  data: Record<string, unknown>;
}

export interface MemoriesBatchCreateParams {
  /** The memories to create for the customer. Must be non-empty. */
  memories: Memory[];
}
