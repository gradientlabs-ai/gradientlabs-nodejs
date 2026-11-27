/** A file uploaded to the workspace. */
export interface WorkspaceFile {
  id: string;
  /** The name a back-office test case uses to list this file as an attachment. */
  ref: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  created: string;
}

export interface BeginFileUploadParams {
  /** The Content-Type the upload sends. Defaults to "application/octet-stream". */
  content_type?: string;
}

/** Where and how to upload a file's contents. */
export interface FileUpload {
  /** Pass this to `files.create` once the file has been uploaded. */
  upload_id: string;
  /** The URL to send the file to as an HTTP PUT, with every header in `headers`. */
  upload_url: string;
  content_type: string;
  /** Every header the PUT must send, Content-Type included. */
  headers: Record<string, string>;
  /** When `upload_url` stops accepting the file. */
  expires_at: string;
  /** The largest file that can be uploaded, in bytes. */
  max_bytes: number;
}

export interface CreateFileParams {
  /** The `upload_id` that `files.beginUpload` returned. */
  upload_id: string;
  /** The file's name, which the AI agent sees: 1 to 200 characters with no slashes. */
  file_name: string;
  /** Optional unique reference for the file. Made from `file_name` when omitted. */
  ref?: string;
}

export interface ListFilesParams {
  /** Opaque pagination cursor from a previous response. */
  cursor?: string;
}
