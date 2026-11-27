import type { HttpClient } from "../internal/http.js";
import type { Page } from "../internal/pagination.js";
import { paginate } from "../internal/pagination.js";
import type { RequestConfig } from "../request-config.js";
import type {
  CreateNoteParams,
  ListNotesParams,
  Note,
  SetNoteStatusParams,
  UpdateNoteParams,
} from "../models/notes.js";

interface ListNotesResponse {
  notes: Note[];
  pagination: { next?: string };
}

/**
 * Note management endpoints. Requires a Management API key.
 */
export class Notes {
  constructor(private readonly http: HttpClient) {}

  /** Retrieves one page of the company's notes. */
  async list(params: ListNotesParams = {}, config: RequestConfig = {}): Promise<Page<Note>> {
    const rsp = await this.http.request<ListNotesResponse>("GET", "notes", {
      query: { cursor: params.cursor },
      signal: config.signal,
    });
    return { data: rsp.notes, pageInfo: rsp.pagination };
  }

  /** Iterates over all notes, transparently following pagination cursors. */
  listAll(
    params: Omit<ListNotesParams, "cursor"> = {},
    config: RequestConfig = {},
  ): AsyncGenerator<Note, void, undefined> {
    return paginate((cursor) => this.list({ ...params, cursor }, config));
  }

  /** Retrieves a note by its ID. */
  get(id: string, config: RequestConfig = {}): Promise<Note> {
    return this.http.request("GET", `notes/${encodeURIComponent(id)}`, {
      signal: config.signal,
    });
  }

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
