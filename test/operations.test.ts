import { describe, expect, it } from "vitest";

import { GradientLabs } from "../src/index.js";

// Maps each public API contract operation id this library implements to its
// method. `GET /spec.json` (operation id `Spec`) is deliberately not exposed.
export const OPERATIONS: Record<string, string> = {
  ArticleUpsert: "articles.upsert",
  ArticleSetUsageStatus: "articles.setUsageStatus",
  ArticleDelete: "articles.delete",
  BackOfficeTaskCreate: "backOfficeTasks.create",
  BackOfficeTaskDelete: "backOfficeTasks.delete",
  BackOfficeTaskRead: "backOfficeTasks.get",
  ConversationStart: "conversations.start",
  ConversationCancel: "conversations.cancel",
  ConversationFinish: "conversations.finish",
  ConversationAddMessage: "conversations.addMessage",
  ConversationResume: "conversations.resume",
  ConversationReturnAsyncToolResult: "conversations.returnAsyncToolResult",
  ConversationDelete: "conversations.delete",
  ConversationReadDeprecated: "conversations.getDeprecated",
  ConversationAssign: "conversations.assign",
  ConversationEvent: "conversations.addEvent",
  ConversationRate: "conversations.rate",
  ConversationRead: "conversations.get",
  CustomerMemoriesList: "customers.listMemories",
  CustomerMemoriesBatchCreate: "customers.batchCreateMemories",
  CustomerMemoriesBatchCreateV2: "customers.batchCreateMemoriesV2",
  FileUploadBegin: "files.beginUpload",
  FileList: "files.list",
  FileCreate: "files.create",
  HandOffTargetDelete: "handOffTargets.delete",
  ListHandOffTargets: "handOffTargets.list",
  HandOffTargetUpsert: "handOffTargets.upsert",
  GetDefaultHandOffTarget: "handOffTargets.getDefault",
  SetDefaultHandOffTarget: "handOffTargets.setDefault",
  IPAddressList: "ipAddresses.list",
  KnowledgeBaseList: "knowledgeBases.list",
  KnowledgeBaseCreate: "knowledgeBases.create",
  KnowledgeBaseRead: "knowledgeBases.get",
  KnowledgeBaseUpdate: "knowledgeBases.update",
  NoteList: "notes.list",
  NoteCreate: "notes.create",
  NoteDelete: "notes.delete",
  NoteRead: "notes.get",
  NoteUpdate: "notes.update",
  NoteSetStatus: "notes.setStatus",
  OutboundChatConversationStart: "outboundConversations.startChat",
  OutboundEmailConversationStart: "outboundConversations.startEmail",
  OutboundPhoneConversationStart: "outboundConversations.startPhone",
  ReadProcedure: "procedures.get",
  SetProcedureLimit: "procedures.setLimit",
  ListProcedures: "procedures.list",
  ProcedureListVersions: "procedures.listVersions",
  ProcedureSetGatedVersion: "procedures.setGatedVersion",
  ProcedureSetLiveVersion: "procedures.setLiveVersion",
  ProcedureUnsetGatedVersion: "procedures.unsetGatedVersion",
  ProcedureUnsetLiveVersion: "procedures.unsetLiveVersion",
  ResourceSourceList: "resourceSources.list",
  ResourceSourceCreate: "resourceSources.create",
  ResourceSourceDelete: "resourceSources.delete",
  ResourceSourceRead: "resourceSources.get",
  ResourceSourceUpdate: "resourceSources.update",
  UpdateSchemaByExamples: "resourceSources.updateSchemaByExamples",
  ResourceTypeList: "resourceTypes.list",
  ResourceTypeCreate: "resourceTypes.create",
  ResourceTypeDelete: "resourceTypes.delete",
  ResourceTypeRead: "resourceTypes.get",
  ResourceTypeUpdate: "resourceTypes.update",
  SecretList: "secrets.list",
  SecretRevoke: "secrets.revoke",
  SecretWrite: "secrets.write",
  TerminologySubstitutionList: "terminologySubstitutions.list",
  TerminologySubstitutionCreate: "terminologySubstitutions.create",
  TerminologySubstitutionDelete: "terminologySubstitutions.delete",
  TerminologySubstitutionRead: "terminologySubstitutions.get",
  TerminologySubstitutionUpdate: "terminologySubstitutions.update",
  ToolList: "tools.list",
  ToolCreate: "tools.create",
  ToolDelete: "tools.delete",
  ToolRead: "tools.get",
  ToolUpdate: "tools.update",
  ToolExecute: "tools.execute",
  ReadTopic: "topics.get",
  ListTopics: "topics.list",
  ArticleTopicUpsert: "topics.upsert",
  ListTrafficGroups: "trafficGroups.list",
  TrafficGroupCreate: "trafficGroups.create",
  TrafficGroupDelete: "trafficGroups.delete",
  TrafficGroupUpdate: "trafficGroups.update",
  TrafficGroupExclusionCreate: "trafficGroups.addExclusion",
  TrafficGroupExclusionDelete: "trafficGroups.removeExclusion",
  TrafficGroupTargetCreate: "trafficGroups.addTarget",
  TrafficGroupTargetDelete: "trafficGroups.removeTarget",
  VoiceCallContextRead: "voice.getLatestCallContext",
};

describe("public API operations", () => {
  const client = new GradientLabs({ apiKey: "sk_test_123" }) as unknown as Record<
    string,
    Record<string, unknown>
  >;

  it.each(Object.entries(OPERATIONS))("%s is implemented as %s", (_operationId, method) => {
    const [group, name] = method.split(".") as [string, string];
    expect(typeof client[group]?.[name]).toBe("function");
  });

  it("maps every operation to a distinct method", () => {
    const methods = Object.values(OPERATIONS);
    expect(new Set(methods).size).toBe(methods.length);
  });
});
