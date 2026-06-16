import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateTrafficGroupParams,
  TrafficGroup,
  TrafficGroupTarget,
  TrafficGroupTargetParams,
  UpdateTrafficGroupParams,
} from "../models/traffic-groups.js";

interface ListResponse {
  traffic_groups: TrafficGroup[];
}

/**
 * Traffic group management endpoints. Requires a Management API key.
 */
export class TrafficGroups {
  constructor(private readonly http: HttpClient) {}

  /** Lists all traffic groups for the company. */
  async list(config: RequestConfig = {}): Promise<TrafficGroup[]> {
    const rsp = await this.http.request<ListResponse>("GET", "traffic-groups", {
      signal: config.signal,
    });
    return rsp.traffic_groups;
  }

  /** Creates a new traffic group. */
  create(params: CreateTrafficGroupParams, config: RequestConfig = {}): Promise<TrafficGroup> {
    return this.http.request("POST", "traffic-groups", { body: params, signal: config.signal });
  }

  /** Updates an existing traffic group. */
  update(
    id: string,
    params: UpdateTrafficGroupParams,
    config: RequestConfig = {},
  ): Promise<TrafficGroup> {
    return this.http.request("PUT", `traffic-groups/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Deletes a traffic group and all associated targets. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `traffic-groups/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Adds a target to a traffic group. */
  addTarget(
    id: string,
    params: TrafficGroupTargetParams,
    config: RequestConfig = {},
  ): Promise<TrafficGroupTarget> {
    return this.http.request("POST", `traffic-groups/${encodeURIComponent(id)}/targets`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Removes a target from a traffic group. */
  removeTarget(id: string, targetId: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request(
      "DELETE",
      `traffic-groups/${encodeURIComponent(id)}/targets/${encodeURIComponent(targetId)}`,
      { signal: config.signal },
    );
  }

  /** Excludes a target (e.g. a procedure) from a traffic group. */
  addExclusion(
    id: string,
    params: TrafficGroupTargetParams,
    config: RequestConfig = {},
  ): Promise<TrafficGroupTarget> {
    return this.http.request("POST", `traffic-groups/${encodeURIComponent(id)}/exclusions`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Removes a target exclusion from a traffic group. */
  removeExclusion(id: string, targetId: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request(
      "DELETE",
      `traffic-groups/${encodeURIComponent(id)}/exclusions/${encodeURIComponent(targetId)}`,
      { signal: config.signal },
    );
  }
}
