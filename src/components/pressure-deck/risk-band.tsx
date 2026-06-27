'use client';

import { cn } from '@/lib/utils';

const levelColors: Record<string, string> = {
  LOW: 'text-system-green bg-system-green/10 border-system-green/20',
  LOW_MEDIUM: 'text-system-green bg-system-green/10 border-system-green/20',
  MODERATE: 'text-electric-blue bg-electric-blue/10 border-electric-blue/20',
  MEDIUM: 'text-electric-blue bg-electric-blue/10 border-electric-blue/20',
  MEDIUM_HIGH: 'text-signal-amber bg-signal-amber/10 border-signal-amber/20',
  HIGH: 'text-signal-amber bg-signal-amber/10 border-signal-amber/20',
  STRONG: 'text-system-green bg-system-green/10 border-system-green/20',
  VERY_STRONG: 'text-system-green bg-system-green/10 border-system-green/20',
  CRITICAL: 'text-critical-red bg-critical-red/10 border-critical-red/20',
  WEAK: 'text-critical-red bg-critical-red/10 border-critical-red/20',
};

export function RiskBand({ label, level }: { label: string; level: string }) {
  const colors = levelColors[level] ?? 'text-muted-steel bg-panel-steel/30 border-border-line';
  return (
    <div className={cn('rounded-md border px-2.5 py-1.5', colors)}>
      <span className="text-[10px] text-muted-steel uppercase block">{label}</span>
      <span className="font-mono text-xs font-semibold">{level}</span>
    </div>
  );
}
