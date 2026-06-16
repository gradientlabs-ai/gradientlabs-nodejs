/** A term the agent should avoid and its replacement, optionally resource-scoped. */
export interface TerminologySubstitution {
  id: string;
  blocked: string;
  blocked_description: string;
  replacement: string;
  resource_type_id: string;
  resource_attribute_json_path: string;
  resource_value_to_match: string;
  created: string;
  updated: string;
}

export interface CreateTerminologySubstitutionParams {
  blocked: string;
  blocked_description: string;
  replacement: string;
  resource_type_id?: string;
  resource_attribute_json_path?: string;
  resource_value_to_match?: string;
}

export interface UpdateTerminologySubstitutionParams {
  blocked: string;
  blocked_description: string;
  replacement: string;
  resource_type_id?: string;
  resource_attribute_json_path?: string;
  resource_value_to_match?: string;
}
