/** The most recent voice call context for a phone number. */
export interface VoiceCallContext {
  /** Timestamp (RFC3339) when the call was received by the AI voice agent. */
  started_at: string;
  summary?: string;
  transcript?: string;
  handoff_reason?: string;
  last_executed_procedure?: string;
  last_executed_procedure_url?: string;
  gradient_labs_url?: string;
}

export interface ReadVoiceCallContextParams {
  /** Time window (seconds) to look back for recent call events. Default 60, min 5. */
  lookback_seconds?: number;
  /** Include large fields (full transcript and untruncated summary). */
  include_large_fields?: boolean;
}
