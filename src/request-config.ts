/** Per-request options accepted by every client method. */
export interface RequestConfig {
  /** Cancellation signal, the Node equivalent of Go's context.Context. */
  signal?: AbortSignal;
}
