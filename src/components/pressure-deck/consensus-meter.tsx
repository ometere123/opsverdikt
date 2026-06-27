'use client';

import { cn } from '@/lib/utils';

export function ConsensusMeter({ score }: { score: number }) {
  const band = score >= 80 ? 'VERY_STRONG' : score >= 60 ? 'STRONG' : score >= 40 ? 'MODERATE' : 'LOW';
  const color = score >= 80 ? 'text-system-green' : score >= 60 ? 'text-electric-blue' : score >= 40 ? 'text-signal-amber' : 'text-critical-red';
  const ringColor = score >= 80 ? 'stroke-system-green' : score >= 60 ? 'stroke-electric-blue' : score >= 40 ? 'stroke-signal-amber' : 'stroke-critical-red';

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-border-line" />
          <circle
            cx="32" cy="32" r={radius} fill="none" strokeWidth="4"
            className={ringColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-mono text-sm font-bold', color)}>{score}</span>
        </div>
      </div>
      <span className={cn('font-mono text-[10px] font-semibold mt-1', color)}>{band}</span>
    </div>
  );
}
