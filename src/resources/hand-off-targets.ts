import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  DeleteHandOffTargetParams,
  GetDefaultHandOffTargetParams,
  HandOffTarget,
  SetDefaultHandOffTargetParams,
  UpsertHandOffTargetParams,
} from "../models/hand-off-targets.js";

interface ListHandOffTargetsResponse {
  targets: HandOffTarget[];
}

/**
 * Hand-off target management endpoints. Requires a Management API key.
 */
export class HandOffTargets {
  constructor(private readonly http: HttpClient) {}

  /** Lists the available hand-off targets. */
  async list(config: RequestConfig = {}): Promise<HandOffTarget[]> {
    const rsp = await this.http.request<ListHandOffTargetsResponse>("GET", "hand-off-targets", {
      signal: config.signal,
    });
    return rsp.targets;
  }

  /** Creates or updates a hand-off target. */
  upsert(params: UpsertHandOffTargetParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("POST", "hand-off-targets", { body: params, signal: config.signal });
  }

  /** Deletes a hand-off target. */
  delete(params: DeleteHandOffTargetParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", "hand-off-targets", {
      query: { id: params.id },
      signal: config.signal,
    });
  }

  /** Gets the current default hand-off target for a channel. Returns "" if unset. */
  async getDefault(
    params: GetDefaultHandOffTargetParams,
    config: RequestConfig = {},
  ): Promise<string> {
    const rsp = await this.http.request<{ id: string }>("GET", "hand-off-targets/default", {
      query: { channel: params.channel },
      signal: config.signal,
    });
    return rsp.id;
  }

  /** Sets the default hand-off target for a channel. */
  setDefault(params: SetDefaultHandOffTargetParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("PUT", "hand-off-targets/default", {
      body: params,
      signal: config.signal,
    });
  }
}
