import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';
import { CodeBlock } from '@/components/CodeBlock';
import { structuredExample } from '@/data/examples';
import { providerMappings, project } from '@/data/project';

export function SharedGeneration({ copy }: { copy: Dictionary['generation'] }) {
  return (
    <section className="block" id="generation">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div className="grid grid-cols-2 items-start gap-8 max-[920px]:grid-cols-1">
          <div className="grid gap-4">
            {copy.capabilities.map((capability) => (
              <article
                className="rounded-xl border border-line bg-surface p-5"
                key={capability.field}
              >
                <code className="text-xs text-accent">{capability.field}</code>
                <h3 className="mt-2 mb-2 text-[17px] font-semibold">
                  {capability.title}
                </h3>
                <p className="text-[15px] text-muted">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
          <figure className="min-w-0 overflow-hidden rounded-[14px] border border-code-line bg-code-bg">
            <figcaption className="border-b border-code-line px-[22px] py-3 font-mono text-xs text-code-dim">
              structured_output.py{' '}
              <span className="float-right">
                {copy.new} {project.version}
              </span>
            </figcaption>
            <pre className="overflow-x-auto px-[22px] py-5 text-[13px] leading-[1.7] text-code-ink">
              <CodeBlock id="structured-example" code={structuredExample} />
            </pre>
            <p className="border-t border-code-line px-[22px] py-3 text-[13px] text-code-dim">
              <InlineCode text={copy.response} />
            </p>
          </figure>
        </div>
        <div className="mapping-desktop mt-8 rounded-xl border border-line">
          <table className="w-full table-fixed border-collapse text-left text-sm [overflow-wrap:anywhere]">
            <caption className="bg-surface px-5 py-4 text-left text-base font-semibold text-ink">
              {copy.mapping}
            </caption>
            <thead className="border-y border-line bg-page text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  {copy.field}
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  OpenAI
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Anthropic
                </th>
              </tr>
            </thead>
            <tbody>
              {providerMappings.map(([field, openai, anthropic]) => (
                <tr
                  key={field}
                  className="border-b border-line bg-surface last:border-0"
                >
                  <th
                    scope="row"
                    className="px-5 py-3 font-mono font-medium text-accent"
                  >
                    {field}
                  </th>
                  <td className="px-5 py-3 font-mono text-xs">{openai}</td>
                  <td className="px-5 py-3 font-mono text-xs">{anthropic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mapping-mobile mt-8 gap-3" aria-label={copy.mapping}>
          {providerMappings.map(([field, openai, anthropic]) => (
            <article
              key={field}
              className="min-w-0 rounded-xl border border-line bg-surface p-5"
            >
              <h3 className="mb-4 font-mono text-sm font-semibold text-accent">
                {field}
              </h3>
              <dl className="grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-3 text-xs">
                <dt className="text-muted">OpenAI</dt>
                <dd className="font-mono [overflow-wrap:anywhere]">{openai}</dd>
                <dt className="text-muted">Anthropic</dt>
                <dd className="font-mono [overflow-wrap:anywhere]">
                  {anthropic}
                </dd>
              </dl>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`${project.docs}guide/generation/`}>{copy.guide}</a>
          <a href={`${project.docs}unification/`}>{copy.limits}</a>
        </div>
        <p className="mt-4 max-w-[70em] text-sm text-muted">
          <InlineCode text={copy.reasoning} />
        </p>
      </div>
    </section>
  );
}
