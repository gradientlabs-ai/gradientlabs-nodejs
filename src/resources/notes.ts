import type { HttpClient } from "../internal/http.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateNoteParams,
  Note,
  SetNoteStatusParams,
  UpdateNoteParams,
} from "../models/notes.js";

/**
 * Note management endpoints. Requires a Management API key.
 */
export class Notes {
  constructor(private readonly http: HttpClient) {}

  /** Creates a new note. */
  create(params: CreateNoteParams, config: RequestConfig = {}): Promise<Note> {
    return this.http.request("POST", "notes", { body: params, signal: config.signal });
  }

  /** Updates an existing note's contents. */
  update(id: string, params: UpdateNoteParams, config: RequestConfig = {}): Promise<Note> {
    return this.http.request("POST", `notes/${encodeURIComponent(id)}`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Updates a note's status. */
  setStatus(id: string, params: SetNoteStatusParams, config: RequestConfig = {}): Promise<void> {
    return this.http.request("POST", `notes/${encodeURIComponent(id)}/status`, {
      body: params,
      signal: config.signal,
    });
  }

  /** Marks a note as deleted. */
  delete(id: string, config: RequestConfig = {}): Promise<void> {
    return this.http.request("DELETE", `notes/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }
}
