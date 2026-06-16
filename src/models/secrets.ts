import type { HttpDefinition } from "./tools.js";

/** HTTP mechanism for refreshing a secret's value. */
export interface RefreshMechanismHttp {
  request_definition: HttpDefinition;
  /** Name of the parameter in the (JSON) response body. */
  response_param_name: string;
}

/** A configured secret. The value itself is never returned. */
export interface Secret {
  name: string;
  created: string;
  updated: string;
  expiry?: string;
  refresh_mechanism_http?: RefreshMechanismHttp;
}

export interface WriteSecretParams {
  value: string;
  expiry?: string;
  refresh_mechanism_http?: RefreshMechanismHttp;
}
