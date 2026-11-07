import { SectionHeading } from '@/components/SectionHeading';
import { project } from '@/data/project';
import type { Dictionary } from '@/data/i18n/en';

export function FAQ({ copy }: { copy: Dictionary['faq'] }) {
  return (
    <section className="block" id="faq">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div className="grid grid-cols-2 items-start gap-4 max-[760px]:grid-cols-1">
          {copy.items.map((entry) => (
            <details
              key={entry.question}
              className="faq-item group min-w-0 rounded-xl border border-line bg-surface p-5"
            >
              <summary className="cursor-pointer text-[15px] font-semibold text-ink marker:text-accent">
                {entry.question}
              </summary>
              <div className="faq-body">
                <p className="mt-4 text-[15px] text-muted">{entry.answer}</p>
                <a
                  className="mt-3 inline-block text-sm font-medium"
                  href={`${project.docs}${entry.path}`}
                >
                  {copy.guide}
                </a>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
