import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateKnowledgeBaseParams,
  KnowledgeBase,
  UpdateKnowledgeBaseParams,
} from "../models/knowledge-bases.js";

/**
 * Knowledge base management endpoints. Requires a Management API key.
 */
export class KnowledgeBases {
  constructor(private readonly http: HttpClient) {}

  /** Lists the knowledge bases created through the API. */
  async list(config: RequestConfig = {}): Promise<KnowledgeBase[]> {
    const rsp = await this.http.request<{ knowledge_bases: KnowledgeBase[] }>(
      "GET",
      "knowledge-bases",
      { signal: config.signal },
    );
    return rsp.knowledge_bases;
  }

  /** Creates a knowledge base. */
  create(params: CreateKnowledgeBaseParams, config: RequestConfig = {}): Promise<KnowledgeBase> {
    return this.http.request("POST", "knowledge-bases", { body: params, signal: config.signal });
  }

  /** Retrieves a knowledge base by its ID. */
  get(id: string, config: RequestConfig = {}): Promise<KnowledgeBase> {
    return this.http.request("GET", `knowledge-bases/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Renames a knowledge base. */
  update(
    id: string,
    params: UpdateKnowledgeBaseParams,
    config: RequestConfig = {},
  ): Promise<KnowledgeBase> {
    return this.http.request("POST", `knowledge-bases/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }
}
