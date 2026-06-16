import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type { SetArticleUsageStatusParams, UpsertArticleParams } from "../models/articles.js";

/**
 * Article management endpoints. Requires a Management API key.
 */
export class Articles {
  constructor(private readonly http: HttpClient) {}

  /** Creates or updates a help article. */
  upsert(params: UpsertArticleParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("POST", "articles", { body: params, signal: config.signal });
  }

  /** Updates whether the AI agent can use an article or not. */
  setUsageStatus(
    id: string,
    params: SetArticleUsageStatusParams,
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request("POST", `articles/${encodeURIComponent(id)}/usage-status`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Marks an article as deleted. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `articles/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }
}
