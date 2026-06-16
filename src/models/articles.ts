import type { ArticleStatus, ArticleUsageStatus, ArticleVisibility } from "./enums.js";

export interface UpsertArticleParams {
  /** External identifier the company uses for this article. */
  id: string;
  author_id: string;
  title: string;
  description: string;
  body: string;
  visibility: ArticleVisibility;
  /** External identifier of the topic this article belongs to. */
  topic_id: string;
  status: ArticleStatus;
  /** Additional meta-data about the article. */
  data: Record<string, unknown>;
  created: string;
  last_edited: string;
  public_url: string;
}

export interface SetArticleUsageStatusParams {
  usage_status: ArticleUsageStatus;
}

/** An article topic. */
export interface Topic {
  Source: string;
  ExternalID: string;
  Name: string;
  Description: string;
  Visibility: ArticleVisibility;
  ParentExternalID: string;
  Created: string;
  LastEdited: string;
  LastSeen: string;
  /** Base64-encoded raw representation of the topic from the support platform. */
  Data: string;
  PublicURL: string;
}

export interface ListTopicsParams {
  /** Which platform's topics to read. Defaults to "public-api". */
  support_platform?: string;
}

export interface ReadTopicParams {
  /** Which platform's topic to read. Defaults to "public-api". */
  support_platform?: string;
}

export interface UpsertTopicParams {
  /** External identifier the company uses for this topic. */
  id: string;
  /** External identifier of this topic's parent topic. */
  parent_id: string;
  name: string;
  description: string;
  visibility: ArticleVisibility;
  status: ArticleStatus;
  data: Record<string, unknown>;
  created: string;
  last_edited: string;
  public_url: string;
}
