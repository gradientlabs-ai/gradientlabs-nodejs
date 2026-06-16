import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateResourceSourceParams,
  ResourceSource,
  UpdateResourceSourceParams,
  UpdateSchemaByExamplesParams,
} from "../models/resources.js";

interface ListResourceSourcesResponse {
  resource_sources: ResourceSource[];
}

/**
 * Resource source management endpoints. Requires a Management API key.
 */
export class ResourceSources {
  constructor(private readonly http: HttpClient) {}

  /** Lists all resource sources accessible to the company. */
  async list(config: RequestConfig = {}): Promise<ResourceSource[]> {
    const rsp = await this.http.request<ListResourceSourcesResponse>("GET", "resource-sources", {
      signal: config.signal,
    });
    return rsp.resource_sources;
  }

  /** Creates a new resource source. */
  create(params: CreateResourceSourceParams, config: RequestConfig = {}): Promise<ResourceSource> {
    return this.http.request("POST", "resource-sources", { body: params, signal: config.signal });
  }

  /** Retrieves a specific resource source by ID. */
  get(id: string, config: RequestConfig = {}): Promise<ResourceSource> {
    return this.http.request("GET", `resource-sources/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Updates an existing resource source. */
  update(
    id: string,
    params: UpdateResourceSourceParams,
    config: RequestConfig = {},
  ): Promise<ResourceSource> {
    return this.http.request("PUT", `resource-sources/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Deletes a resource source. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `resource-sources/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Modifies the source schema based on the provided payload examples. */
  updateSchemaByExamples(
    id: string,
    params: UpdateSchemaByExamplesParams,
    config: RequestConfig = {},
  ): Promise<ResourceSource> {
    return this.http.request(
      "POST",
      `resource-sources/${encodeURIComponent(id)}/schema-by-examples`,
      { body: params, signal: config.signal },
    );
  }
}
