'use client';

import { useReportWebVitals } from 'next/web-vitals';

// Keep one stable callback and expose only metric summaries, never URLs or DOM entries.
const reportVital: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (!['LCP', 'INP', 'CLS'].includes(metric.name)) return;
  const detail = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };
  window.dispatchEvent(new CustomEvent('aiollm:web-vital', { detail }));
  if (process.env.NODE_ENV === 'development') {
    console.debug('[aiollm:web-vital]', detail);
  }
};

export function WebVitals() {
  useReportWebVitals(reportVital);
  return null;
}
