import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';
import { CodeBlock } from '@/components/CodeBlock';
import { toolsExample } from '@/data/examples';
import { project } from '@/data/project';

export function Tools({ copy }: { copy: Dictionary['tools'] }) {
  return (
    <section className="block" id="tools">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div className="grid grid-cols-2 items-start gap-8 max-[920px]:grid-cols-1">
          <figure className="min-w-0 overflow-hidden rounded-[14px] border border-code-line bg-code-bg">
            <figcaption className="border-b border-code-line px-[22px] py-3 font-mono text-xs text-code-dim">
              tools.py{' '}
              <span className="float-right">
                {copy.new} {project.version}
              </span>
            </figcaption>
            <pre className="overflow-x-auto px-[22px] py-5 text-[13px] leading-[1.7] text-code-ink">
              <CodeBlock id="tools-example" code={toolsExample} />
            </pre>
            <p className="border-t border-code-line px-[22px] py-3 text-[13px] text-code-dim">
              <InlineCode text={copy.caption} />
            </p>
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
              href={`${project.docs}guide/tools/`}
            >
              {copy.guide}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
