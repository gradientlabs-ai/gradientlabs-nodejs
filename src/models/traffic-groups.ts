/** An assigned or excluded target within a traffic group. */
export interface TrafficGroupTarget {
  target_type: string;
  target_id: string;
}

/** A traffic group scoping which procedures conversations can access. */
export interface TrafficGroup {
  id: string;
  name: string;
  targets: TrafficGroupTarget[];
  excluded_targets: TrafficGroupTarget[];
}

export interface CreateTrafficGroupParams {
  name: string;
}

export interface UpdateTrafficGroupParams {
  name: string;
}

export interface TrafficGroupTargetParams {
  /** Type of target, e.g. "procedure". */
  target_type: string;
  target_id: string;
}
