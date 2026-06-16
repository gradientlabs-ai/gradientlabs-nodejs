import type { UserDetails } from "./common.js";
import type { ProcedureStatus } from "./enums.js";

/** An AI agent procedure that defines how the agent should handle conversations. */
export interface Procedure {
  id: string;
  name: string;
  description: string;
  status: ProcedureStatus;
  author: UserDetails;
  created: string;
  updated: string;
  has_daily_limit: boolean;
  max_daily_conversations: number;
}

/** Configuration limiting a gated procedure version. */
export interface GatedConfig {
  MaxDailyConversations: number;
}

/** A specific saved version of a procedure. */
export interface ProcedureVersion {
  Name: string;
  Description: string;
  Version: number;
  Author: string;
  Created: string;
  Gated: boolean;
  GatedConfig: GatedConfig;
  Live: boolean;
}

export interface ListProceduresParams {
  /** Opaque pagination cursor from a previous response. */
  cursor?: string;
  /** Filter by status, e.g. "live" or "draft". */
  status?: ProcedureStatus;
}

export interface SetProcedureLimitParams {
  has_daily_limit?: boolean;
  max_daily_conversations?: number;
}

export interface SetGatedVersionParams {
  max_daily_conversations: number;
  /** Replace an existing gated version if one exists. */
  replace: boolean;
}
