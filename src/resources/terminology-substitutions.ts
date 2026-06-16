import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateTerminologySubstitutionParams,
  TerminologySubstitution,
  UpdateTerminologySubstitutionParams,
} from "../models/terminology.js";

interface ListResponse {
  substitutions: TerminologySubstitution[];
}

/**
 * Terminology substitution management endpoints. Requires a Management API key.
 */
export class TerminologySubstitutions {
  constructor(private readonly http: HttpClient) {}

  /** Returns all terminology substitutions configured for the organization. */
  async list(config: RequestConfig = {}): Promise<TerminologySubstitution[]> {
    const rsp = await this.http.request<ListResponse>("GET", "terminology-substitutions", {
      signal: config.signal,
    });
    return rsp.substitutions;
  }

  /** Creates a new terminology substitution. */
  create(
    params: CreateTerminologySubstitutionParams,
    config: RequestConfig = {},
  ): Promise<TerminologySubstitution> {
    return this.http.request("POST", "terminology-substitutions", {
      body: params,
      signal: config.signal,
    });
  }

  /** Returns a single terminology substitution by ID. */
  get(id: string, config: RequestConfig = {}): Promise<TerminologySubstitution> {
    return this.http.request("GET", `terminology-substitutions/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Updates an existing terminology substitution. */
  update(
    id: string,
    params: UpdateTerminologySubstitutionParams,
    config: RequestConfig = {},
  ): Promise<TerminologySubstitution> {
    return this.http.request("PUT", `terminology-substitutions/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Deletes a terminology substitution by ID. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `terminology-substitutions/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }
}
