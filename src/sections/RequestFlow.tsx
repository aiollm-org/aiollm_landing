import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';

export function RequestFlow({ copy }: { copy: Dictionary['flow'] }) {
  return (
    <section className="block" id="flow">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <ol className="flow grid list-none grid-cols-6 max-[920px]:grid-cols-1 max-[920px]:gap-[22px] gap-0 p-0">
          {copy.steps.map((step, index) => (
            <li
              key={step.title}
              className={index >= 2 && index <= 4 ? 'step core' : 'step'}
            >
              <span className="node">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>
                <InlineCode text={step.description} />
              </p>
            </li>
          ))}
        </ol>
        <p className="retry-note mt-7 flex items-baseline gap-2.5 text-[15px] text-muted">
          <span className="pill">3–5</span>
          <span>
            <InlineCode text={copy.note} />
          </span>
        </p>
      </div>
    </section>
  );
}
