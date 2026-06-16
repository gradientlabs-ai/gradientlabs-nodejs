/** A hand-off target (team, agent, or queue) a conversation can be routed to. */
export interface HandOffTarget {
  id: string;
  name: string;
}

export interface UpsertHandOffTargetParams {
  id: string;
  name: string;
}

export interface DeleteHandOffTargetParams {
  id: string;
}

export interface GetDefaultHandOffTargetParams {
  /** The conversation channel to get the default for. */
  channel: string;
}

export interface SetDefaultHandOffTargetParams {
  /** Target ID to set as default. Empty string clears the default. */
  id: string;
  channel: string;
}
