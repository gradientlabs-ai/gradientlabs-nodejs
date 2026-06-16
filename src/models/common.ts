import type { AttachmentType } from "./enums.js";

/** Basic information about a user, e.g. the author of a procedure. */
export interface UserDetails {
  email: string;
}

/** A file or media item attached to a conversation message. */
export interface Attachment {
  type: AttachmentType;
  /** Original file name including extension. */
  file_name: string;
  /** Publicly accessible URL where the attachment can be downloaded. */
  url: string;
  /** Optional short summary of what the attachment is. */
  summary: string;
  /** Optional full textual extract of the attachment's contents. */
  description: string;
}
