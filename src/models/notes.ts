import type { NoteStatus } from "./enums.js";

/** A note that provides the AI agent with time-bound context. */
export interface Note {
  /** Gradient Labs' internal ID for this note. */
  gradient_labs_id: string;
  /** The company's external ID for this note. */
  id: string;
  title: string;
  body?: string;
  url?: string;
  /** Which customers the note applies to, as attribute keys mapped to their values. */
  attributes?: Record<string, string[]>;
  valid_from?: string;
  valid_to?: string;
  last_modified_by: string;
  created: string;
  updated: string;
  status: NoteStatus;
}

export interface ListNotesParams {
  /** Opaque pagination cursor from a previous response. */
  cursor?: string;
}

export interface CreateNoteParams {
  /** External identifier the company uses for this note. */
  id: string;
  title: string;
  /** Main contents of the note. Send exactly one of body and webpage_url. */
  body?: string;
  /** Webpage to use as the note body. Send exactly one of body and webpage_url. */
  webpage_url?: string;
  /** When the note becomes relevant. */
  start_time?: string;
  /** When the note is no longer relevant. */
  end_time?: string;
  /** Which customers the note applies to. Omit for a note that applies to every conversation. */
  attributes?: Record<string, string[]>;
  /** External IDs of the knowledge bases the note belongs to. Defaults to "public-api". */
  knowledge_base_ids?: string[];
}

export interface UpdateNoteParams {
  title: string;
  body?: string;
  webpage_url?: string;
  start_time?: string;
  end_time?: string;
  attributes?: Record<string, string[]>;
  knowledge_base_ids?: string[];
}

export interface SetNoteStatusParams {
  /** Either "draft" or "live". */
  status: NoteStatus;
}
