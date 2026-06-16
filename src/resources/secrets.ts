import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type { Secret, WriteSecretParams } from "../models/secrets.js";

interface ListSecretsResponse {
  secrets: Secret[];
}

/**
 * Secret management endpoints. Requires a Management API key.
 */
export class Secrets {
  constructor(private readonly http: HttpClient) {}

  /** Lists the company's configured secrets. */
  async list(config: RequestConfig = {}): Promise<Secret[]> {
    const rsp = await this.http.request<ListSecretsResponse>("GET", "secrets", {
      signal: config.signal,
    });
    return rsp.secrets;
  }

  /** Creates or updates a secret. */
  write(name: string, params: WriteSecretParams, config: RequestConfig = {}): Promise<Secret> {
    return this.http.request("PUT", `secrets/${encodeURIComponent(name)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Revokes a secret so it can no longer be used. */
  revoke(name: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `secrets/${encodeURIComponent(name)}`, {
      signal: config.signal,
    });
  }
}
