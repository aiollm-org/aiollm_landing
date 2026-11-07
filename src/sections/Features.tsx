import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';

const icons = [
  <svg key="feature-0" viewBox="0 0 24 24">
    <path d="M4 7h16M4 12h10M4 17h7" />
    <path d="M17 15l2 2 3-4" />
  </svg>,
  <svg key="feature-1" viewBox="0 0 24 24">
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </svg>,
  <svg key="feature-2" viewBox="0 0 24 24">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </svg>,
  <svg key="feature-3" viewBox="0 0 24 24">
    <path d="M12 3l9 16H3z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>,
  <svg key="feature-4" viewBox="0 0 24 24">
    <path d="M12 15V4M7 9l5-5 5 5" />
    <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
  </svg>,
  <svg key="feature-5" viewBox="0 0 24 24">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>,
];

export function Features({ copy }: { copy: Dictionary['features'] }) {
  return (
    <section className="block" id="features">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div className="features grid grid-cols-3 max-[920px]:grid-cols-2 max-[600px]:grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line">
          {copy.items.map((item, index) => (
            <article
              key={item.title}
              className="feature grid min-w-0 content-start gap-2.5 bg-surface px-[26px] pt-7 pb-[30px]"
            >
              <span className="ico" aria-hidden="true">
                {icons[index]}
              </span>
              <h3>{item.title}</h3>
              <p>
                <InlineCode text={item.description} />
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
