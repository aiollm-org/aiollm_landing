import type { ReactNode } from 'react';

export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="head mb-11 grid max-w-[46em] gap-3">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
