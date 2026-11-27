# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1]

Tool lists include enabled MCP tools. Tool updates support webhook, HTTP, async and draft tools.

## [0.2.0]

### Removed

- **Breaking**: `StartConversationParams.metadata`. The API has no such field and
  ignored it; the `metadata` on `action.execute` and `resource.pull` webhooks is
  not set through this call.

### Changed

- **Breaking**: `HandOffTarget` now has a `ref` field, and `Note`,
  `Procedure`, `Topic`, `Attachment`, `AgentMetadata`, `Conversation`, `Schema`,
  `Attribute` and `SourceConfig` fields the API can omit are now optional.
- **Breaking**: `Conversation.status` is typed as `ConversationStatus`,
  `FinishConversationParams.reason_code` as `ConversationFinishReasonCode` and
  `TrafficGroupTarget.target_type` as `TrafficGroupTargetType`. Each still
  accepts any string.
- `CreateNoteParams` and `UpdateNoteParams` no longer require `body`,
  `webpage_url`, `start_time` and `end_time`.

### Added

- `client.customers` with `listMemories()`, `batchCreateMemoriesV2()` and the
  deprecated `batchCreateMemories()` for the `/customers/{customer_id}/memories`
  endpoints.
- `client.files` with `beginUpload()`, `create()`, `list()` and `listAll()`.
- `client.knowledgeBases` with `list()`, `create()`, `get()` and `update()`.
- `client.notes.list()`, `.listAll()` and `.get()`, and `attributes` and
  `knowledge_base_ids` on notes.
- `knowledge_base_ids` on `UpsertArticleParams`, `ref` on
  `UpsertHandOffTargetParams`, `live_handoff_url` on `VoiceCallContext`,
  `retry` on `HttpDefinition`, `transfer_mode` on `ToolParameter`, `branch_id`
  and `branch_name` on tool, resource source and resource type creation, and
  `managed` on `ResourceSource`.
- The `conversation.start` webhook event.
- `kustomer` support platform and customer source, the
  `salesforce_contact_email` and `salesforce_supplied_email` identifier types,
  and the `json` and `attachment` tool parameter types.

### Fixed

- Failures reading a response body are now thrown as `GradientLabsError` with
  the original `cause`, instead of propagating as a raw error.
- The README webhook example now handles `UnknownWebhookTypeError` by
  responding 200, matching `examples/webhooks`.

## [0.1.3]

### Removed

- **Breaking**: `client.outboundConversations.start()` and
  `StartOutboundConversationParams`, following the removal of
  `POST /outbound/conversations` from the API.
- **Breaking**: the `customer_source` field on outbound conversation start. It
  has no replacement — `customer_id` is now always your own customer ID, and
  third-party platform IDs go in `customer_support_platform_identifiers`.

### Added

- `client.outboundConversations.startChat()`, `.startEmail()` and
  `.startPhone()`, one per channel, with
  `StartOutboundChatConversationParams`, `StartOutboundEmailConversationParams`
  and `StartOutboundPhoneConversationParams`. `support_platform` is now required
  on chat and email; phone takes `to_phone_number` and `from_phone_number`
  instead.

### Changed

- **Breaking**: requires Node.js 22 or newer (`engines` was `>=20`). Node.js 20
  has no fix for the eMudhra certificate authority compromise below.

### Security

- The client uses Node's built-in `fetch`, which trusts the CA list bundled with
  your Node.js release. Node.js releases before 22.23.4, 24.22.1 and 26.12.1
  still trust the compromised eMudhra intermediate certificate authorities
  disclosed in October 2026, which would let an attacker impersonate the
  Gradient Labs API. Run Node.js 22.23.4, 24.22.1, 26.12.1 or later.

## [0.1.2]

### Added

- `client.conversations.delete()` and `client.backOfficeTasks.delete()`.
- `reason_code` on finishing a conversation.
- `customer_support_platform_identifiers` on starting a conversation.

## [Unreleased]

### Added

- Initial release of the Gradient Labs Node.js / TypeScript client.
