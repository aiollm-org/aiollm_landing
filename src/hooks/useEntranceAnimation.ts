'use client';

import { useEffect } from 'react';
import { useAnimate, useReducedMotion } from 'motion/react';

/** Keep SSR and hydration visible and identical; animate only after mounting. */
export function useEntranceAnimation(delay = 0) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!scope.current) return;
    const animation = animate(
      scope.current,
      reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1], y: [18, 0] },
      reducedMotion ? { duration: 0 } : { duration: 0.45, delay },
    );
    return () => animation.stop();
  }, [animate, delay, reducedMotion, scope]);

  return scope;
}
