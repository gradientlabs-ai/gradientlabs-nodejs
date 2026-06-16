import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  ListTopicsParams,
  ReadTopicParams,
  Topic,
  UpsertTopicParams,
} from "../models/articles.js";

interface ListTopicsResponse {
  Topics: Topic[];
}

/**
 * Article topic management endpoints. Requires a Management API key.
 */
export class Topics {
  constructor(private readonly http: HttpClient) {}

  /** Lists the company's topics, optionally filtered by support platform. */
  async list(params: ListTopicsParams = {}, config: RequestConfig = {}): Promise<Topic[]> {
    const rsp = await this.http.request<ListTopicsResponse>("GET", "topics", {
      query: { support_platform: params.support_platform },
      signal: config.signal,
    });
    return rsp.Topics;
  }

  /** Reads a single article topic. */
  get(id: string, params: ReadTopicParams = {}, config: RequestConfig = {}): Promise<Topic> {
    return this.http.request("GET", `topic/${encodeURIComponent(id)}`, {
      query: { support_platform: params.support_platform },
      signal: config.signal,
    });
  }

  /** Creates or updates an article topic. */
  upsert(params: UpsertTopicParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("POST", "topics", { body: params, signal: config.signal });
  }
}
