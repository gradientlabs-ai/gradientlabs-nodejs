import { VERSION } from "./version.js";

/**
 * Builds the User-Agent header identifying this client library, in the format
 * `Gradient-Labs-Node/<pkg-version> (node/<runtime-version>)`.
 */
export function userAgent(): string {
  const runtimeVersion =
    typeof process !== "undefined" && process.version ? process.version : "unknown";
  return `Gradient-Labs-Node/${VERSION} (node/${runtimeVersion})`;
}
