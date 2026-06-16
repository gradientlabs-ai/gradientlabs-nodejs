import type { NoteStatus } from "./enums.js";

/** A note that provides the AI agent with time-bound context. */
export interface Note {
  /** Gradient Labs' internal ID for this note. */
  gradient_labs_id: string;
  /** The company's external ID for this note. */
  id: string;
  title: string;
  body: string;
  url: string;
  valid_from: string;
  valid_to: string;
  last_modified_by: string;
  created: string;
  updated: string;
  status: NoteStatus;
}

export interface CreateNoteParams {
  /** External identifier the company uses for this note. */
  id: string;
  title: string;
  /** Main contents of the note. Mutually exclusive with webpage_url. */
  body: string;
  /** Webpage to use as the note body. Mutually exclusive with body. */
  webpage_url: string;
  /** When the note becomes relevant. */
  start_time: string;
  /** When the note is no longer relevant. */
  end_time: string;
}

export interface UpdateNoteParams {
  title: string;
  body: string;
  webpage_url: string;
  start_time: string;
  end_time: string;
}

export interface SetNoteStatusParams {
  status: NoteStatus;
}
