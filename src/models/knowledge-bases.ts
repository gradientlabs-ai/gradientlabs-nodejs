/** A knowledge base, which controls which AI agents can use the articles and notes in it. */
export interface KnowledgeBase {
  /** Gradient Labs' internal ID for this knowledge base. */
  gradient_labs_id: string;
  /** The company's external ID for this knowledge base. */
  id: string;
  name: string;
  created: string;
  updated: string;
}

export interface CreateKnowledgeBaseParams {
  /** External identifier the company uses for this knowledge base. */
  id: string;
  name: string;
}

export interface UpdateKnowledgeBaseParams {
  name: string;
}
