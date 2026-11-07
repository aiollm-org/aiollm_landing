'use client';

import { useEffect, type ReactNode } from 'react';
import { stagger, useAnimate, useReducedMotion } from 'motion/react';

/** The server supplies the content; Motion enhances it after hydration. */
export function HeroEntrance({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!scope.current) return;
    const animation = animate(
      Array.from(scope.current.children),
      reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0.65, 1], y: [26, 0] },
      reducedMotion
        ? { duration: 0 }
        : { duration: 0.8, delay: stagger(0.09), ease: 'easeOut' },
    );
    return () => animation.stop();
  }, [animate, reducedMotion, scope]);

  return (
    <div ref={scope} className="hero-copy grid min-w-0 grid-cols-1 gap-[26px]">
      {children}
    </div>
  );
}
