import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";

/** The IP addresses Gradient Labs uses, in CIDR format. */
export interface IpAddresses {
  /** Addresses the public API is served from. */
  api: string[];
  /** Addresses outbound (egress) requests originate from. */
  egress: string[];
}

/**
 * IP address endpoints. Requires a Management API key.
 */
export class IpAddressesResource {
  constructor(private readonly http: HttpClient) {}

  /** Returns the list of IP addresses Gradient Labs uses, in CIDR format. */
  list(config: RequestConfig = {}): Promise<IpAddresses> {
    return this.http.request("GET", "ip-addresses", { signal: config.signal });
  }
}
