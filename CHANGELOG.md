# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
