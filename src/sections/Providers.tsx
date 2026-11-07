import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { CodeBlock } from '../components/CodeBlock';
import { providerExample } from '../data/examples';
import { project } from '@/data/project';

export function Providers({ copy }: { copy: Dictionary['providers'] }) {
  return (
    <section className="block" id="providers">
      <div className="wrap providers grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-12 max-[920px]:grid-cols-1 max-[920px]:gap-8">
        <div>
          <div className="head mb-7 grid max-w-[46em] gap-3">
            <span className="eyebrow">{copy.label}</span>
            <h2>{copy.title}</h2>
            <p>
              <InlineCode text={copy.description} />
            </p>
          </div>
          <div className="prov-list grid gap-3">
            <div className="prov">
              <h3>OpenAIClient</h3>
              <span className="api text-right text-[13px] text-muted">
                Responses API
              </span>
              <p>
                <InlineCode text={copy.openai} />
              </p>
            </div>
            <div className="prov">
              <h3>AnthropicClient</h3>
              <span className="api text-right text-[13px] text-muted">
                Messages API
              </span>
              <p>
                <InlineCode text={copy.anthropic} />
              </p>
            </div>
            <div className="prov own">
              <h3>BaseProviderClient</h3>
              <span className="api text-right text-[13px] text-muted">
                {copy.own}
              </span>
              <p>
                <InlineCode text={copy.ownDescription} />
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted">
            <InlineCode text={copy.note} />
          </p>
          <a
            className="mt-3 inline-block text-sm font-medium"
            href={`${project.docs}guide/providers/`}
          >
            {copy.guide}
          </a>
        </div>
        <pre className="small-code min-w-0 overflow-x-auto rounded-[14px] border border-code-line bg-code-bg px-[22px] py-5 text-[13.5px] leading-[1.7] text-code-ink">
          <CodeBlock id="any-provider" code={providerExample} />
        </pre>
      </div>
    </section>
  );
}
