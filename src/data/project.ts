// Reviewed against the repository, 0.9.0 release notes, and published guides on 2026-11-06.
export const project = {
  version: '0.9.0',
  python: '3.13+',
  repository: 'https://github.com/GrehBan/aiollm',
  landing: 'https://aiollm.dev',
  docs: 'https://docs.aiollm.dev/',
  reviewedOn: '2026-11-06',
} as const;

export const documentationPages = [
  {
    title: 'Methods',
    path: 'guide/methods/',
    description:
      'Declare endpoints, body fields, query parameters, and typed results.',
  },
  {
    title: 'Uploads',
    path: 'guide/uploads/',
    description:
      'Bytes, paths, binary files, and one-shot sources with explicit ownership.',
  },
  {
    title: 'Streaming',
    path: 'guide/streaming/',
    description: 'Raw chunks, text, SSE, NDJSON, and protocol terminal checks.',
  },
  {
    title: 'Errors and retries',
    path: 'guide/errors/',
    description:
      'Status, transport, and response errors; bounded retry policies.',
  },
  {
    title: 'Sessions',
    path: 'guide/sessions/',
    description:
      'Connection pools, authentication, headers, and per-call timeouts.',
  },
  {
    title: 'Providers',
    path: 'guide/providers/',
    description:
      'OpenAI Responses and Anthropic Messages, with their native methods.',
  },
  {
    title: 'Shared generation',
    path: 'guide/generation/',
    description:
      'Conversations, structured output, effort, and shared stream events.',
  },
  {
    title: 'Resources and use cases',
    path: 'guide/resources/',
    description:
      'Compose provider-neutral operations above methods and sessions.',
  },
  {
    title: 'Extending',
    path: 'guide/extending/',
    description:
      'Build an adapter, bind a resource, or implement another transport.',
  },
  {
    title: 'Design',
    path: 'guide/design/',
    description: 'Type safety, network defaults, limitations, and versioning.',
  },
] as const;

export const generationCapabilities = [
  {
    title: 'Conversations, explicitly',
    field: 'Turn',
    description:
      'Build a conversation from user and assistant turns. Carry an earlier answer forward with response.to_turn(); put the system prompt in instructions.',
  },
  {
    title: 'JSON to your schema',
    field: 'output_schema',
    description:
      'Send a JSON Schema through the shared API. The result remains JSON text; check incomplete_reason before parsing it. Each provider supports its own schema subset.',
  },
  {
    title: 'Control the effort',
    field: 'Effort',
    description:
      'Request LOW, MEDIUM, HIGH, XHIGH, or MAX. Omit it to keep the model’s default; the provider decides which levels that model accepts.',
  },
  {
    title: 'Keep the full answer',
    field: 'GenerationResponse',
    description:
      'Read text, token usage, refusals, and completion status in shared fields. Provider-specific details stay available in raw.',
  },
] as const;

export const providerMappings = [
  ['instructions', 'instructions', 'system'],
  ['max_output_tokens', 'max_output_tokens', 'max_tokens'],
  ['effort', 'reasoning.effort', 'output_config.effort'],
  ['output_schema', 'text.format', 'output_config.format'],
  ['end_user_id', 'safety_identifier', 'metadata.user_id'],
] as const;

export const faqEntries = [
  {
    question: 'Is aiollm a replacement for every official SDK endpoint?',
    answer:
      'The built-in clients cover OpenAI’s Responses API and Anthropic’s Messages API, with shared text generation on top. Use native methods and typed provider_options for provider-specific features; the shared interface is deliberately smaller.',
    path: 'guide/providers/',
  },
  {
    question: 'Does a dropped stream automatically start again?',
    answer:
      'No. Opening a retryable stream may be retried, but a failure after it starts reaches your code. Streams are neither automatically resumed nor replayed, so your application does not receive duplicated output.',
    path: 'guide/streaming/',
  },
  {
    question: 'What is the difference between an omitted value and null?',
    answer:
      'A field left MISSING is not sent. An explicit None becomes null only where that method’s schema allows it. Shared generation’s optional fields use MISSING and do not accept None.',
    path: 'guide/methods/',
  },
  {
    question: 'Can I use another provider or HTTP transport?',
    answer:
      'Yes. Sessions depend on protocols for the API, authentication, headers, parsers, and error resolver. Add method classes and an adapter for a provider; implement a transport below BaseSession to change the HTTP client.',
    path: 'guide/extending/',
  },
  {
    question: 'Is there a synchronous API?',
    answer:
      'The library is async-only. Use async with to own a client or session and release its connections when the operation ends.',
    path: 'guide/sessions/',
  },
  {
    question: 'What does pre-alpha mean for upgrades?',
    answer:
      'The public API can still change. Before 1.0, breaking changes increase the minor version, and the changelog records the migration. Version 0.9 is followed by 0.10; 1.0 marks an API stability commitment.',
    path: 'guide/design/#versioning',
  },
] as const;
