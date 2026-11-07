'use client';

import { useEffect, useRef } from 'react';

/** Size of one hexagon of the lattice, as drawn in lattice.svg. */
const CELL_WIDTH = 84;
const CELL_HEIGHT = 97;
/** Cells that can fade out at once while the pointer moves on. */
const TRAIL = 6;
/** Only a mouse or pen, and only when the visitor allows motion. */
const INTERACTIVE =
  '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)';

export function HeroBackdrop() {
  const backdrop = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = backdrop.current?.parentElement;
    const cellLayer = grid.current;
    if (!hero || !cellLayer) return;
    const cells = Array.from(
      cellLayer.querySelectorAll<HTMLElement>('.hero-cell'),
    );
    const media = window.matchMedia(INTERACTIVE);
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let current = '';
    let next = 0;

    // The cell layer drifts with the lattice, so the cell under a still
    // pointer changes too: follow it on every frame while the pointer is in.
    const update = () => {
      frame = 0;
      if (!pointer) return;
      const heroBox = hero.getBoundingClientRect();
      const x = pointer.x - heroBox.left;
      const y = pointer.y - heroBox.top;
      const ratio = Math.min(1, Math.max(0, x / heroBox.width));
      hero.style.setProperty('--hero-x', `${x}px`);
      hero.style.setProperty('--hero-y', `${y}px`);
      hero.style.setProperty('--hero-mix', `${Math.round(ratio * 100)}%`);
      hero.style.setProperty(
        '--hero-angle',
        `${Math.round(90 + ratio * 90)}deg`,
      );

      const layer = cellLayer.getBoundingClientRect();
      const column = Math.floor((pointer.x - layer.left) / CELL_WIDTH);
      const row = Math.floor((pointer.y - layer.top) / CELL_HEIGHT);
      const key = `${column}:${row}`;
      if (key !== current) {
        current = key;
        for (const cell of cells) cell.classList.remove('is-on');
        const cell = cells[next++ % cells.length];
        cell.style.left = `${column * CELL_WIDTH}px`;
        cell.style.top = `${row * CELL_HEIGHT}px`;
        // Restart the entrance even when this element was just fading out.
        void cell.offsetWidth;
        cell.classList.add('is-on');
      }
      frame = requestAnimationFrame(update);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      hero.dataset.pointer = 'on';
      if (!frame) frame = requestAnimationFrame(update);
    };
    const leave = () => {
      pointer = null;
      current = '';
      cancelAnimationFrame(frame);
      frame = 0;
      delete hero.dataset.pointer;
      for (const cell of cells) cell.classList.remove('is-on');
    };
    const attach = () => {
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', leave);
    };
    const detach = () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      leave();
    };
    const change = () => (media.matches ? attach() : detach());

    change();
    media.addEventListener('change', change);
    return () => {
      media.removeEventListener('change', change);
      detach();
    };
  }, []);

  return (
    <div className="hero-backdrop" aria-hidden="true" ref={backdrop}>
      <div className="hero-glow hero-glow-blue" />
      <div className="hero-glow hero-glow-violet" />
      <div className="hero-pointer" />
      <div className="hero-lattice" />
      <div className="hero-cells" ref={grid}>
        {Array.from({ length: TRAIL }, (_, index) => (
          <span className="hero-cell" key={index}>
            <span />
          </span>
        ))}
      </div>
      <div className="hero-horizon" />
    </div>
  );
}
