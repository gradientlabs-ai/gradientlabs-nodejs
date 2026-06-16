import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type { BackOfficeTask, CreateBackOfficeTaskParams } from "../models/back-office-tasks.js";

/**
 * Back-office task endpoints. Requires an Integration API key.
 */
export class BackOfficeTasks {
  constructor(private readonly http: HttpClient) {}

  /** Creates a new back-office task. */
  create(params: CreateBackOfficeTaskParams, config: RequestConfig = {}): Promise<BackOfficeTask> {
    return this.http.request("POST", "back-office-tasks", {
      body: params,
      signal: config.signal,
    });
  }

  /** Retrieves detailed information about a back-office task. */
  get(id: string, config: RequestConfig = {}): Promise<BackOfficeTask> {
    return this.http.request("GET", `back-office-tasks/${encodeURIComponent(id)}/read`, {
      signal: config.signal,
    });
  }
}
