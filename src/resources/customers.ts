import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  BatchCreateMemoriesV2Params,
  MemoriesBatchCreateParams,
  Memory,
} from "../models/customers.js";

/**
 * Customer endpoints. Requires an Integration API key.
 */
export class Customers {
  constructor(private readonly http: HttpClient) {}

  /** Lists all memories currently retained for a customer. */
  async listMemories(customerId: string, config: RequestConfig = {}): Promise<Memory[]> {
    const rsp = await this.http.request<{ memories: Memory[] }>(
      "GET",
      `customers/${encodeURIComponent(customerId)}/memories`,
      { signal: config.signal },
    );
    return rsp.memories;
  }

  /**
   * Creates a batch of memories for a customer for the agent to search over on
   * demand, where each memory's category is a plain name. The call is
   * asynchronous: it returns once the batch is accepted. Throws an
   * {@link ApiError} with status 409 if a batch is already being created for
   * the same customer.
   *
   * @deprecated Use {@link Customers.batchCreateMemoriesV2} instead, which also
   * takes a category description.
   */
  batchCreateMemories(
    customerId: string,
    params: MemoriesBatchCreateParams,
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request("POST", `customers/${encodeURIComponent(customerId)}/memories`, {
      body: params,
      signal: config.signal,
    });
  }

  /**
   * Creates a batch of memories for a customer for the agent to search over on
   * demand. The call is asynchronous: it returns once the batch is accepted.
   * Throws an {@link ApiError} with status 409 if a batch is already being
   * created for the same customer.
   */
  batchCreateMemoriesV2(
    customerId: string,
    params: BatchCreateMemoriesV2Params,
    config: RequestConfig = {},
  ): Promise<void> {
    return this.http.request("POST", `customers/${encodeURIComponent(customerId)}/memories/v2`, {
      body: params,
      signal: config.signal,
    });
  }
}
