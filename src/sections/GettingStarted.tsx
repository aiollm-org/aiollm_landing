import type { Dictionary } from '@/data/i18n/en';
import { InlineCode } from '@/components/InlineCode';
import { SectionHeading } from '@/components/SectionHeading';
import { project } from '@/data/project';

export function GettingStarted({ copy }: { copy: Dictionary['start'] }) {
  return (
    <section className="block" id="getting-started">
      <div className="wrap">
        <SectionHeading label={copy.label} title={copy.title}>
          {copy.description}
        </SectionHeading>
        <ol className="grid list-none grid-cols-3 gap-4 max-[920px]:grid-cols-1">
          <li className="setup-card min-w-0 rounded-[14px] border border-line bg-surface p-6">
            <span className="eyebrow">{copy.install}</span>
            <h3 className="mt-4 mb-3 text-lg font-semibold">{copy.clone}</h3>
            <div className="setup-terminal" aria-label={copy.commands}>
              <div className="setup-terminal-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <b>{copy.terminal}</b>
              </div>
              <ol className="setup-commands">
                {[
                  'git clone https://github.com/GrehBan/aiollm.git',
                  'cd aiollm',
                  'uv sync',
                ].map((command) => (
                  <li key={command}>
                    <span aria-hidden="true">$</span>
                    <code>{command}</code>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-3 text-sm text-muted">
              <InlineCode text={copy.pip} />
            </p>
          </li>
          <li className="setup-card min-w-0 rounded-[14px] border border-line bg-surface p-6">
            <span className="eyebrow">{copy.configure}</span>
            <h3 className="mt-4 mb-3 text-lg font-semibold">{copy.key}</h3>
            <p className="text-[15px] text-muted">
              <InlineCode text={copy.configureDescription} />
            </p>
            <div className="mt-4 grid gap-2 font-mono text-xs text-accent">
              <code>OPENAI_API_KEY</code>
              <code>ANTHROPIC_API_KEY</code>
            </div>
            <a
              className="mt-4 inline-block text-sm font-medium"
              href={`${project.docs}guide/providers/`}
            >
              {copy.setup} <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li className="setup-card min-w-0 rounded-[14px] border border-line bg-surface p-6">
            <span className="eyebrow">{copy.call}</span>
            <h3 className="mt-4 mb-3 text-lg font-semibold">{copy.level}</h3>
            <p className="text-[15px] text-muted">
              <InlineCode text={copy.callDescription} />
            </p>
            <div className="mt-4 grid gap-2 text-sm font-medium">
              <a href="#generation">{copy.generation}</a>
              <a href="#tools">{copy.tools}</a>
              <a href="#streaming">{copy.streaming}</a>
              <a href={`${project.docs}guide/methods/`}>{copy.api}</a>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
