import type {
  AttachmentType,
  CustomerSupportPlatformIdentifierType,
  SupportPlatform,
} from "./enums.js";

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
  summary?: string;
  /** Optional full textual extract of the attachment's contents. */
  description?: string;
}

/** Links a customer to their record in a third-party support platform. */
export interface CustomerSupportPlatformIdentifier {
  support_platform: SupportPlatform;
  /**
   * Only meaningful for platforms with more than one kind of identifier
   * (e.g. Intercom's "lead" vs "user", or Salesforce's contact vs account
   * ID). Omit for platforms without such a distinction (Freshchat,
   * Freshdesk).
   */
  type?: CustomerSupportPlatformIdentifierType;
  /** The external ID in that platform. */
  value: string;
}
