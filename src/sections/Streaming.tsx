import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';
import { CodeBlock } from '@/components/CodeBlock';
import { checkedStreamExample } from '@/data/examples';
import { project } from '@/data/project';

export function Streaming({ copy }: { copy: Dictionary['streaming'] }) {
  return (
    <section className="block" id="streaming">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div className="grid grid-cols-2 items-start gap-8 max-[920px]:grid-cols-1">
          <figure className="min-w-0 overflow-hidden rounded-[14px] border border-code-line bg-code-bg">
            <figcaption className="border-b border-code-line px-[22px] py-3 font-mono text-xs text-code-dim">
              checked_stream.py
            </figcaption>
            <pre className="overflow-x-auto px-[22px] py-5 text-[13px] leading-[1.7] text-code-ink">
              <CodeBlock
                id="checked-stream-example"
                code={checkedStreamExample}
              />
            </pre>
          </figure>
          <div className="grid gap-5">
            {copy.items.map((item) => (
              <article key={item.title}>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-[15px] text-muted">
                  <InlineCode text={item.description} />
                </p>
              </article>
            ))}
            <a
              className="text-sm font-medium"
              href={`${project.docs}guide/streaming/`}
            >
              {copy.guide}
            </a>
          </div>
        </div>
        <aside
          className="mt-8 rounded-xl border border-line bg-surface p-6"
          aria-label={copy.policyLabel}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">{copy.bounded}</h3>
            <a
              className="text-sm"
              href={`${project.docs}guide/errors/#retry-policy`}
            >
              {copy.reference}
            </a>
          </div>
          <dl className="mt-5 grid grid-cols-4 gap-5 max-[600px]:grid-cols-2">
            {copy.policy.map(([value, label]) => (
              <div key={value}>
                <dt className="font-mono text-xl font-semibold text-accent">
                  {value}
                </dt>
                <dd className="mt-2 text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">{copy.note}</p>
        </aside>
      </div>
    </section>
  );
}
