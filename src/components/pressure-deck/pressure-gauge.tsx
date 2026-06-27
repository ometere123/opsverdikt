'use client';

import { cn } from '@/lib/utils';

const levelConfig = {
  LOW: { color: 'text-system-green', bg: 'bg-system-green', width: '25%', glow: '' },
  MODERATE: { color: 'text-electric-blue', bg: 'bg-electric-blue', width: '50%', glow: '' },
  HIGH: { color: 'text-signal-amber', bg: 'bg-signal-amber', width: '75%', glow: 'glow-amber' },
  CRITICAL: { color: 'text-critical-red', bg: 'bg-critical-red', width: '100%', glow: 'glow-red' },
};

export function PressureGauge({ level, label }: { level: string; label?: string }) {
  const config = levelConfig[level as keyof typeof levelConfig] ?? levelConfig.LOW;

  return (
    <div className="space-y-1.5">
      {label && <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-deep-console overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', config.bg)}
            style={{ width: config.width }}
          />
        </div>
        <span className={cn('font-mono text-xs font-semibold', config.color)}>{level}</span>
      </div>
    </div>
  );
}
