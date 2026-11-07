'use client';

import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';

type CodeSample = {
  id: string;
  label: string;
  caption: { lead: string; highlight: string; tail: string };
  content: ReactNode;
};

export function CodeExamples({
  samples,
  labels,
}: {
  samples: readonly CodeSample[];
  labels: { code: string; python: string };
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const entranceRef = useEntranceAnimation(0.1);
  const active = samples[activeIndex];

  return (
    <Tabs
      value={active.id}
      onValueChange={(value) => {
        const index = samples.findIndex((example) => example.id === value);
        if (index !== -1) setActiveIndex(index);
      }}
      className="gap-0"
      asChild
    >
      <motion.div
        className="code-win"
        aria-label={labels.code}
        ref={entranceRef}
        initial={false}
      >
        <TabsList
          variant="line"
          aria-label={labels.python}
          className="code-tabs h-auto w-full justify-start rounded-none px-2.5 pt-2.5 pb-0 group-data-[orientation=horizontal]/tabs:h-auto max-[620px]:grid max-[620px]:grid-cols-3 max-[620px]:gap-0"
        >
          <div className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          {samples.map((example, index) => (
            <TabsTrigger
              key={example.id}
              value={example.id}
              className="tab relative h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 pt-[9px] pb-[11px] font-mono text-[13px] leading-none font-medium text-code-dim hover:text-code-ink data-[state=active]:bg-transparent data-[state=active]:text-code-ink after:hidden max-[620px]:px-1 max-[620px]:text-[11px]"
            >
              {example.label}
              {activeIndex === index && (
                <motion.span
                  className="absolute -bottom-px inset-x-0 h-0.5 bg-sky"
                  layoutId="active-code-tab"
                  aria-hidden="true"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 35 }
                  }
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {samples.map((example) => (
          <TabsContent
            value={example.id}
            key={example.id}
            className="flex-none"
            asChild
          >
            <pre lang="en">
              <motion.span
                className="block"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.15 }}
              >
                {example.content}
              </motion.span>
            </pre>
          </TabsContent>
        ))}
        <div className="code-caption" id="caption">
          {active.caption.lead}
          {active.caption.highlight && <code>{active.caption.highlight}</code>}
          {active.caption.tail}
        </div>
      </motion.div>
    </Tabs>
  );
}
