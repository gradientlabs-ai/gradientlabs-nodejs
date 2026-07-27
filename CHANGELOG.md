# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0]

### Added

- `Customers.batchCreateMemories` for `POST /customers/{customer_id}/memories`,
  which asynchronously creates a batch of customer-scoped memories for the agent
  to search over on demand. Returns no body; throws with status 409 if a batch
  is already being created for the same customer.

## [0.1.2]

### Added

- Initial release of the Gradient Labs Node.js / TypeScript client.
