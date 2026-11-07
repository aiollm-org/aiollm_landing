import type { Dictionary } from '@/data/i18n/en';
import { SectionHeading } from '@/components/SectionHeading';
import { project } from '@/data/project';

export function Documentation({ copy }: { copy: Dictionary['documentation'] }) {
  return (
    <section className="block" id="docs">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <div
          className="status grid grid-cols-[auto_minmax(0,1fr)] max-[600px]:grid-cols-1 items-start gap-x-[22px] gap-y-[18px] rounded-[14px] border border-warn-line bg-warn-bg px-7 py-[26px] text-warn-ink"
          role="note"
        >
          <span className="ver">{project.version}</span>
          <div>
            <h3>{copy.releaseTitle}</h3>
            <p>
              {copy.releaseBefore}
              <a href={`${project.docs}changelog/`}>{copy.releaseNotes}</a>
              {copy.between}
              <a href={`${project.docs}guide/design/#versioning`}>
                {copy.versioning}
              </a>
              {copy.releaseAfter}
            </p>
          </div>
        </div>
        <div className="docs mt-7 grid grid-cols-4 gap-3.5 max-[920px]:grid-cols-2 max-[480px]:grid-cols-1">
          {copy.items.map((page) => (
            <a
              className="doc"
              key={page.path}
              href={`${project.docs}${page.path}`}
            >
              <i>{copy.guide}</i>
              <b>{page.title}</b>
              <span>{page.description}</span>
            </a>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
          <a href={`${project.docs}reference/`}>{copy.reference}</a>
          <a href={`${project.repository}/blob/master/CONTRIBUTING.md`}>
            {copy.contribute}
          </a>
          <a href={project.repository}>{copy.source}</a>
        </div>
      </div>
    </section>
  );
}
