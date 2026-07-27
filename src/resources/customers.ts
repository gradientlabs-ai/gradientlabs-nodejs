import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type { MemoriesBatchCreateParams } from "../models/customers.js";

/**
 * Customer endpoints. Requires an Integration API key.
 */
export class Customers {
  constructor(private readonly http: HttpClient) {}

  /**
   * Creates a batch of memories for a customer for the agent to search over on
   * demand. The call is asynchronous: it returns once the batch is accepted and
   * does not wait for the memories to be stored. Throws an {@link ApiError} with
   * status 409 if a batch is already being created for the same customer.
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
}
