import type { HttpClient } from "../internal/http.js";
import type { Page } from "../internal/pagination.js";
import { paginate } from "../internal/pagination.js";
import type { RequestConfig } from "../request-config.js";
import type {
  BeginFileUploadParams,
  CreateFileParams,
  FileUpload,
  ListFilesParams,
  WorkspaceFile,
} from "../models/files.js";

interface ListFilesResponse {
  files: WorkspaceFile[];
  pagination: { next?: string; prev?: string };
}

/**
 * File endpoints. Requires a Management API key. To add a file, call
 * {@link Files.beginUpload}, PUT the file to the returned `upload_url`, then
 * call {@link Files.create} with the `upload_id`.
 */
export class Files {
  constructor(private readonly http: HttpClient) {}

  /** Starts uploading a file. The file itself never passes through this API. */
  beginUpload(params: BeginFileUploadParams = {}, config: RequestConfig = {}): Promise<FileUpload> {
    return this.http.request("POST", "file-uploads", { body: params, signal: config.signal });
  }

  /** Turns an uploaded file into a workspace file. */
  create(params: CreateFileParams, config: RequestConfig = {}): Promise<WorkspaceFile> {
    return this.http.request("POST", "files", { body: params, signal: config.signal });
  }

  /** Retrieves one page of files, newest first. */
  async list(
    params: ListFilesParams = {},
    config: RequestConfig = {},
  ): Promise<Page<WorkspaceFile>> {
    const rsp = await this.http.request<ListFilesResponse>("GET", "files", {
      query: { cursor: params.cursor },
      signal: config.signal,
    });
    return { data: rsp.files, pageInfo: rsp.pagination };
  }

  /** Iterates over all files, transparently following pagination cursors. */
  listAll(
    params: Omit<ListFilesParams, "cursor"> = {},
    config: RequestConfig = {},
  ): AsyncGenerator<WorkspaceFile, void, undefined> {
    return paginate((cursor) => this.list({ ...params, cursor }, config));
  }
}
