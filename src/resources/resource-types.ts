import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateResourceTypeParams,
  ResourceType,
  UpdateResourceTypeParams,
} from "../models/resources.js";

interface ListResourceTypesResponse {
  resource_types: ResourceType[];
}

/**
 * Resource type management endpoints. Requires a Management API key.
 */
export class ResourceTypes {
  constructor(private readonly http: HttpClient) {}

  /** Lists all resource types accessible to the company. */
  async list(config: RequestConfig = {}): Promise<ResourceType[]> {
    const rsp = await this.http.request<ListResourceTypesResponse>("GET", "resource-types", {
      signal: config.signal,
    });
    return rsp.resource_types;
  }

  /** Creates a new resource type. */
  create(params: CreateResourceTypeParams, config: RequestConfig = {}): Promise<ResourceType> {
    return this.http.request("POST", "resource-types", { body: params, signal: config.signal });
  }

  /** Retrieves a specific resource type by ID. */
  get(id: string, config: RequestConfig = {}): Promise<ResourceType> {
    return this.http.request("GET", `resource-types/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Updates an existing resource type. */
  update(
    id: string,
    params: UpdateResourceTypeParams,
    config: RequestConfig = {},
  ): Promise<ResourceType> {
    return this.http.request("PUT", `resource-types/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Deletes a resource type. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `resource-types/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }
}
