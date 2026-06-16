import type { HttpClient } from "../internal/http.js";
import type { Page } from "../internal/pagination.js";
import { paginate } from "../internal/pagination.js";
import type { RequestConfig } from "../request-config.js";
import type {
  ListProceduresParams,
  Procedure,
  ProcedureVersion,
  SetGatedVersionParams,
  SetProcedureLimitParams,
} from "../models/procedures.js";

interface ListProceduresResponse {
  procedures: Procedure[];
  pagination: { next?: string; prev?: string };
}

interface ListVersionsResponse {
  Versions: ProcedureVersion[];
}

/**
 * Procedure management endpoints. Requires a Management API key.
 */
export class Procedures {
  constructor(private readonly http: HttpClient) {}

  /** Retrieves one page of procedures. */
  async list(
    params: ListProceduresParams = {},
    config: RequestConfig = {},
  ): Promise<Page<Procedure>> {
    const rsp = await this.http.request<ListProceduresResponse>("GET", "procedures", {
      query: { cursor: params.cursor, status: params.status },
      signal: config.signal,
    });
    return { data: rsp.procedures, pageInfo: rsp.pagination };
  }

  /** Iterates over all procedures, transparently following pagination cursors. */
  listAll(
    params: Omit<ListProceduresParams, "cursor"> = {},
    config: RequestConfig = {},
  ): AsyncGenerator<Procedure, void, undefined> {
    return paginate((cursor) => this.list({ ...params, cursor }, config));
  }

  /** Retrieves a specific procedure by ID. */
  get(id: string, config: RequestConfig = {}): Promise<Procedure> {
    return this.http.request("GET", `procedure/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Configures daily usage limits for a procedure. Returns the updated procedure. */
  async setLimit(
    id: string,
    params: SetProcedureLimitParams,
    config: RequestConfig = {},
  ): Promise<Procedure> {
    const rsp = await this.http.request<{ procedure: Procedure }>(
      "POST",
      `procedure/${encodeURIComponent(id)}/limit`,
      { body: params, signal: config.signal },
    );
    return rsp.procedure;
  }

  /** Lists the non-ephemeral versions of a procedure. */
  async listVersions(id: string, config: RequestConfig = {}): Promise<ProcedureVersion[]> {
    const rsp = await this.http.request<ListVersionsResponse>(
      "GET",
      `procedures/${encodeURIComponent(id)}/versions`,
      { signal: config.signal },
    );
    return rsp.Versions;
  }

  /** Promotes a procedure version to be the live (production) version. */
  setLiveVersion(id: string, version: number, config: RequestConfig = {}): Promise<void> {
    return this.http.request(
      "POST",
      `procedures/${encodeURIComponent(id)}/versions/${version}/set-live`,
      { signal: config.signal },
    );
  }

  /** Removes a procedure version from being the live revision. */
  unsetLiveVersion(id: string, version: number, config: RequestConfig = {}): Promise<void> {
    return this.http.request(
      "POST",
      `procedures/${encodeURIComponent(id)}/versions/${version}/unset-live`,
      { signal: config.signal },
    );
  }

  /** Marks a procedure version as gated for A/B testing. */
  setGatedVersion(
    id: string,
    version: number,
    params: SetGatedVersionParams,
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request(
      "POST",
      `procedures/${encodeURIComponent(id)}/versions/${version}/set-gated`,
      { body: params, signal: config.signal },
    );
  }

  /** Removes the gated marking from a procedure version. */
  unsetGatedVersion(id: string, version: number, config: RequestConfig = {}): Promise<void> {
    return this.http.request(
      "POST",
      `procedures/${encodeURIComponent(id)}/versions/${version}/unset-gated`,
      { signal: config.signal },
    );
  }
}
