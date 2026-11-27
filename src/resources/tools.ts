import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateToolParams,
  ExecuteToolParams,
  ReadToolParams,
  Tool,
  ToolExecutionResult,
  UpdateToolParams,
} from "../models/tools.js";

interface ToolListResponse {
  tools: Tool[];
}

/**
 * Tool management endpoints. Requires a Management API key.
 */
export class Tools {
  constructor(private readonly http: HttpClient) {}

  /** Lists company tools and enabled MCP tools. Interactive tools are omitted. */
  async list(config: RequestConfig = {}): Promise<Tool[]> {
    const rsp = await this.http.request<ToolListResponse>("GET", "tools", {
      signal: config.signal,
    });
    return rsp.tools;
  }

  /** Creates a new custom tool. */
  create(params: CreateToolParams, config: RequestConfig = {}): Promise<Tool> {
    return this.http.request("POST", "tools", { body: params, signal: config.signal });
  }

  /** Reads a tool by ID and optional version. Enabled MCP tools can be read by ID. Interactive tools return 404. */
  get(id: string, params: ReadToolParams = {}, config: RequestConfig = {}): Promise<Tool> {
    return this.http.request("GET", `tools/${encodeURIComponent(id)}`, {
      query: { version: params.version },
      signal: config.signal,
    });
  }

  /** Updates a webhook, HTTP, async or draft tool. Only draft tools can change kind. Edit repository-managed tools in their files. */
  update(id: string, params: UpdateToolParams, config: RequestConfig = {}): Promise<Tool> {
    return this.http.request("PUT", `tools/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Deletes a tool. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `tools/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

  /** Executes a tool, enabling you to test it without an actual conversation. */
  execute(
    id: string,
    params: ExecuteToolParams,
    config: RequestConfig = {},
  ): Promise<ToolExecutionResult> {
    return this.http.request("POST", `tools/${encodeURIComponent(id)}/execute`, {
      body: { arguments: params.arguments, token: params.token ?? "" },
      signal: config.signal,
    });
  }
}
