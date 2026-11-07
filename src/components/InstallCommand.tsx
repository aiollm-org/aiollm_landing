'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { installCommand } from '../data/examples';
import type { Dictionary } from '@/data/i18n/en';

export function InstallCommand({ labels }: { labels: Dictionary['copy'] }) {
  const [status, setStatus] = useState<'Copy' | 'Copied' | 'Selected'>('Copy');
  const commandRef = useRef<HTMLElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const copyAttempt = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copy() {
    const attempt = ++copyAttempt.current;
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(installCommand);
      if (!mounted.current || attempt !== copyAttempt.current) return;
      setStatus('Copied');
      resetTimer.current = setTimeout(() => setStatus('Copy'), 1600);
    } catch {
      if (
        !mounted.current ||
        attempt !== copyAttempt.current ||
        !commandRef.current
      )
        return;
      const range = document.createRange();
      range.selectNodeContents(commandRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      setStatus('Selected');
    }
  }

  return (
    <div className="install">
      <code id="install-cmd">
        <span className="prompt" aria-hidden="true">
          ${' '}
        </span>
        <span ref={commandRef}>{installCommand}</span>
      </code>
      <Button
        variant="outline"
        className="copy h-8 rounded-[7px] border-line bg-page px-2.5 py-0 font-sans text-[13px] leading-none font-medium text-muted hover:border-accent hover:bg-page hover:text-ink"
        id="copy-install"
        type="button"
        onClick={copy}
        aria-live="polite"
      >
        {labels[status]}
      </Button>
    </div>
  );
}
