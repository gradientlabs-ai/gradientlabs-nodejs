import { ConfigurationError } from "./errors.js";
import { HttpClient, type FetchLike } from "./internal/http.js";
import { Articles } from "./resources/articles.js";
import { BackOfficeTasks } from "./resources/back-office-tasks.js";
import { Conversations } from "./resources/conversations.js";
import { HandOffTargets } from "./resources/hand-off-targets.js";
import { IpAddressesResource } from "./resources/ip-addresses.js";
import { Notes } from "./resources/notes.js";
import { OutboundConversations } from "./resources/outbound-conversations.js";
import { Procedures } from "./resources/procedures.js";
import { ResourceSources } from "./resources/resource-sources.js";
import { ResourceTypes } from "./resources/resource-types.js";
import { Secrets } from "./resources/secrets.js";
import { TerminologySubstitutions } from "./resources/terminology-substitutions.js";
import { Tools } from "./resources/tools.js";
import { Topics } from "./resources/topics.js";
import { TrafficGroups } from "./resources/traffic-groups.js";
import { Voice } from "./resources/voice.js";
import { WebhookVerifier } from "./webhooks/verifier.js";

const DEFAULT_BASE_URL = "https://api.gradient-labs.ai";

export interface GradientLabsConfig {
  /** Your Gradient Labs API key. Required. */
  apiKey: string;
  /** Override the base URL. Defaults to https://api.gradient-labs.ai. */
  baseUrl?: string;
  /** The webhook signing key, required to verify incoming webhooks. */
  webhookSigningKey?: string;
  /** Maximum accepted age of a webhook, in milliseconds. Defaults to 5 minutes. */
  webhookLeewayMs?: number;
  /** Inject a custom fetch implementation (tests, proxies, instrumentation). */
  fetch?: FetchLike;
  /** Per-request timeout in milliseconds. No timeout by default. */
  timeoutMs?: number;
}

const defaultFetch: FetchLike = (input, init) =>
  fetch(input, init as RequestInit) as unknown as ReturnType<FetchLike>;

/**
 * The Gradient Labs API client. Construct one with your API key, then access
 * endpoints through the resource namespaces (e.g. `client.conversations.start`).
 */
export class GradientLabs {
  // Integration role (publicapi)
  readonly conversations: Conversations;
  readonly outboundConversations: OutboundConversations;
  readonly backOfficeTasks: BackOfficeTasks;
  readonly voice: Voice;

  // Management role (publicmanagementapi)
  readonly tools: Tools;
  readonly articles: Articles;
  readonly topics: Topics;
  readonly procedures: Procedures;
  readonly handOffTargets: HandOffTargets;
  readonly resourceSources: ResourceSources;
  readonly resourceTypes: ResourceTypes;
  readonly secrets: Secrets;
  readonly notes: Notes;
  readonly terminologySubstitutions: TerminologySubstitutions;
  readonly trafficGroups: TrafficGroups;
  readonly ipAddresses: IpAddressesResource;

  private readonly webhookVerifier?: WebhookVerifier;

  constructor(config: GradientLabsConfig) {
    if (!config.apiKey) {
      throw new ConfigurationError("apiKey is required");
    }

    const http = new HttpClient({
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      apiKey: config.apiKey,
      fetch: config.fetch ?? defaultFetch,
      timeoutMs: config.timeoutMs,
    });

    this.conversations = new Conversations(http);
    this.outboundConversations = new OutboundConversations(http);
    this.backOfficeTasks = new BackOfficeTasks(http);
    this.voice = new Voice(http);

    this.tools = new Tools(http);
    this.articles = new Articles(http);
    this.topics = new Topics(http);
    this.procedures = new Procedures(http);
    this.handOffTargets = new HandOffTargets(http);
    this.resourceSources = new ResourceSources(http);
    this.resourceTypes = new ResourceTypes(http);
    this.secrets = new Secrets(http);
    this.notes = new Notes(http);
    this.terminologySubstitutions = new TerminologySubstitutions(http);
    this.trafficGroups = new TrafficGroups(http);
    this.ipAddresses = new IpAddressesResource(http);

    if (config.webhookSigningKey) {
      this.webhookVerifier = new WebhookVerifier({
        signingKey: config.webhookSigningKey,
        leewayMs: config.webhookLeewayMs,
      });
    }
  }

  /**
   * The webhook verifier. Throws {@link ConfigurationError} if the client was
   * created without a `webhookSigningKey`.
   */
  get webhooks(): WebhookVerifier {
    if (!this.webhookVerifier) {
      throw new ConfigurationError(
        "webhookSigningKey is required to verify webhooks; pass it to the GradientLabs constructor",
      );
    }
    return this.webhookVerifier;
  }
}
