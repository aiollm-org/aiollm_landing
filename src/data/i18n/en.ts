import {
  documentationPages,
  faqEntries,
  generationCapabilities,
} from '@/data/project';

const docs: readonly { title: string; description: string; path: string }[] =
  documentationPages;
const faq: readonly { question: string; answer: string; path: string }[] =
  faqEntries;
const capabilities: readonly {
  title: string;
  description: string;
  field: string;
}[] = generationCapabilities;

export const en = {
  seo: {
    title: 'aiollm — Typed, async Python clients for AI APIs',
    description:
      'Build typed, async Python clients with Pydantic and aiohttp. Explore shared OpenAI and Anthropic generation, checked streaming, and declarative API methods.',
  },
  nav: {
    home: 'aiollm home',
    main: 'Main',
    start: 'Get started',
    reference: 'Reference',
    changelog: 'Changelog',
    docs: 'Docs',
    github: 'aiollm on GitHub',
    back: 'Back to top',
    footer: 'Footer',
    documentation: 'Documentation',
    apiReference: 'API reference',
    contributing: 'Contributing',
    license: 'MIT license. Built for async Python clients.',
    language: 'Language',
    skip: 'Skip to content',
  },
  theme: {
    label: 'Color theme',
    appearance: 'Appearance',
    system: 'System',
    dark: 'Dark',
    light: 'Light',
  },
  copy: { Copy: 'Copy', Copied: 'Copied', Selected: 'Selected' },
  hero: {
    before: 'Typed, async clients for ',
    emphasis: 'AI APIs',
    after: ', built from small declarative methods.',
    description:
      'Describe each API call as a Pydantic model whose generic argument is its result. aiollm sends it over `aiohttp`, retries what is safe to retry, and hands back a validated result your type checker already knows.',
    docs: 'Read the docs',
    note: 'Not on PyPI yet. Requires Python 3.13 or newer.',
    facts: 'Project facts',
    strict: 'strict',
    license: 'license',
    code: 'Code examples',
    python: 'Python examples',
    captions: [
      {
        lead: 'Swap in ',
        highlight: 'AnthropicClient',
        tail: ' and the call stays the same.',
      },
      {
        lead: 'A stream cut before its ',
        highlight: 'CompletedEvent',
        tail: ' raises instead of looking complete.',
      },
      {
        lead: 'Any HTTP API: a method is a Pydantic model, its generic argument is the result.',
        highlight: '',
        tail: '',
      },
    ],
  },
  start: {
    label: 'Get started',
    title: 'From source to your first typed response',
    description:
      'Requires Python 3.13+. aiollm is not on PyPI yet; install from the repository and choose the client or endpoint you need.',
    install: '01 / Install',
    clone: 'Clone, then sync',
    commands: 'Installation commands',
    terminal: 'terminal',
    pip: 'Using pip? Run `pip install -e .` inside the cloned repository.',
    configure: '02 / Configure',
    key: 'Bring your provider key',
    configureDescription:
      'Set the corresponding environment variable in your shell. A client reads it when you provide neither a token nor a ready session.',
    setup: 'Client setup guide',
    call: '03 / Make a call',
    level: 'Choose your level',
    callDescription:
      'Use `client.generation` for a shared text API, native provider methods for their exact fields, or declare your own HTTP endpoint.',
    generation: 'Explore shared generation →',
    streaming: 'Work with checked streams →',
    api: 'Describe your own API ↗',
  },
  features: {
    label: 'What you get',
    title: 'The plumbing of an API client, done once and typed end to end',
    description:
      'aiollm is a low-level toolkit. It does not hide HTTP; it makes every request a checked, inspectable object and handles the parts every client gets wrong.',
    items: [
      {
        title: 'Typed methods',
        description:
          '`send_request(method)` returns the method’s result type, and mypy and pyright both infer it.',
      },
      {
        title: 'Buffered and streamed',
        description:
          'JSON models, text, bytes or nothing; streams of typed events from SSE and NDJSON, checked for a declared last event.',
      },
      {
        title: 'Opt-in retries',
        description:
          'Transient failures retry with exponential backoff and jitter, honouring `Retry-After`; a `RetryPolicy` tunes them per session or per call.',
      },
      {
        title: 'Structured errors',
        description:
          'One class per common HTTP status, plus transport and response errors, each with the provider’s code, the request id and a `transient` flag.',
      },
      {
        title: 'File uploads',
        description:
          'From bytes, a path, a binary file or an async iterator. Replayable sources reopen for retries; one-shot sources explicitly disable them.',
      },
      {
        title: 'Safe defaults',
        description:
          'Path parameters are escaped, redirects are off, environment proxies are ignored, and tokens stay out of `repr` and logs.',
      },
    ],
  },
  generation: {
    label: 'Shared generation',
    title: 'One request shape. The provider’s details still intact.',
    description:
      'Pass keyword arguments or a GenerationRequest to create() or stream(). The same calling code works with either built-in client through IGenerationClient.',
    capabilities,
    new: 'New in',
    response:
      'The response keeps its JSON text in `text`. Check `incomplete_reason` before parsing it.',
    mapping: 'How shared fields reach each provider',
    field: 'Shared field',
    guide: 'Shared generation guide ↗',
    limits: 'Full field mapping and provider limits ↗',
    reasoning:
      'Reasoning summaries are available when requested with the provider’s typed options. Shared streams expose them as `ReasoningDeltaEvent`; `events.text()` returns only text deltas. Invalid provider options raise `RequestValidationError` before anything is sent.',
  },
  flow: {
    label: 'Request flow',
    title: 'One path for every call, with the retry exactly where it belongs',
    description:
      'Each stage is a protocol, so the API, authentication, error mapping, headers and JSON codec can be swapped without touching the rest.',
    steps: [
      {
        title: 'BaseAPIMethod',
        description:
          'A Pydantic model: path, verb, body format and result type.',
      },
      {
        title: 'send_request',
        description: 'The session builds headers and auth, and logs the call.',
      },
      {
        title: '_send_once',
        description: 'Retried by tenacity, only if the method is retryable.',
      },
      {
        title: 'transport',
        description: '`aiohttp` sends it and buffers or streams the response.',
      },
      {
        title: 'status check',
        description: 'The resolver turns a bad status into a typed error.',
      },
      {
        title: 'parser',
        description: 'The body is validated into the method’s result type.',
      },
    ],
    note: 'Steps in light blue run inside each attempt, so an error’s `transient` flag alone decides whether to try again.',
  },
  providers: {
    label: 'Providers',
    title: 'Two providers today, one generation API',
    description:
      '`client.generation` takes the same request for every provider and returns shared types, with the provider’s own response kept in `raw`.',
    openai: 'Reads `OPENAI_API_KEY`; quota errors are typed and never retried.',
    anthropic:
      'Reads `ANTHROPIC_API_KEY`; a 529 overload is a transient error.',
    own: 'your provider',
    ownDescription:
      'Bring an `IAPI`, a resolver and adapters; the shared contract tests run against it.',
    note: 'Choose a model supported by the client you pass in. Anthropic uses a default output budget of 16,000 tokens when the shared request omits it.',
    guide: 'Native methods, sessions, and provider options ↗',
  },
  streaming: {
    label: 'Streaming & reliability',
    title: 'Know whether a stream actually finished',
    description:
      'Work with bytes, decoded text, SSE, or NDJSON. For event streams, a declared protocol terminal distinguishes a complete response from a connection that ended early.',
    items: [
      {
        title: 'Exactly one completion event',
        description:
          'Shared streams end with one `CompletedEvent`. A stream ending without it raises `APIStreamInterruptedError`; another event after completion raises `APIResponseError`.',
      },
      {
        title: 'Retry the opening, not the output',
        description:
          'Once iteration starts, failures reach your code. Retries require an opted-in method, a transient error, and a replayable request body. Quota errors and one-shot uploads are not retried.',
      },
      {
        title: 'Cleanup follows the context',
        description:
          'Leaving `async with` releases the connection, including on an early break or an exception. Reading a stream after the context exits raises `RuntimeError`.',
      },
    ],
    guide: 'Read the streaming contract ↗',
    policyLabel: 'Default retry policy',
    bounded: 'Bounded by default',
    reference: 'RetryPolicy reference ↗',
    policy: [
      ['4', 'attempts, including the first'],
      ['900 s', 'retry-start deadline'],
      ['60 s', 'maximum accepted Retry-After'],
      ['30 s', 'maximum exponential backoff'],
    ],
    note: 'A policy tunes eligible retries; it cannot make a non-transient error retryable. Per-attempt timeouts still apply.',
  },
  documentation: {
    label: 'Keep exploring',
    title: 'From the first call to your own provider',
    description:
      'Follow the guides for the contracts, then use the generated reference for every public type and method.',
    releaseTitle: 'Pre-alpha: new capabilities, an evolving public API',
    releaseBefore:
      'Version 0.9.0 adds effort controls, structured output, and reasoning summaries. It also replaces shared metadata with end_user_id. Before 1.0, breaking changes bump the minor version: 0.9 is followed by 0.10. Read the ',
    releaseNotes: 'release notes',
    between: ' and ',
    versioning: 'versioning policy',
    releaseAfter: ' before upgrading.',
    guide: 'guide',
    reference: 'Browse the API reference ↗',
    contribute: 'Contribute to aiollm ↗',
    source: 'Read the source ↗',
    items: docs,
  },
  faq: {
    label: 'Before you build',
    title: 'A few useful boundaries',
    description:
      'What the shared API handles, where provider-specific behavior belongs, and what to expect before 1.0.',
    guide: 'Read the guide ↗',
    items: faq,
  },
};

export type Dictionary = typeof en;
