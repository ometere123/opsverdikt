'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface Bottleneck {
  zone: string;
  description: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

const severityColors: Record<string, string> = {
  LOW: 'border-system-green/30 text-system-green',
  MODERATE: 'border-electric-blue/30 text-electric-blue',
  HIGH: 'border-signal-amber/30 text-signal-amber glow-amber',
  CRITICAL: 'border-critical-red/30 text-critical-red glow-red',
};

export function BottleneckRadar({ bottlenecks }: { bottlenecks: Bottleneck[] }) {
  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-signal-amber" />
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Bottleneck Radar</h3>
      </div>
      {bottlenecks.length === 0 ? (
        <p className="text-xs text-muted-steel text-center py-4">No bottlenecks detected</p>
      ) : (
        <div className="space-y-1.5">
          {bottlenecks.map((b, i) => (
            <div key={i} className={cn('rounded border px-2.5 py-1.5 text-xs', severityColors[b.severity])}>
              <div className="flex justify-between">
                <span className="font-semibold">{b.zone}</span>
                <span className="font-mono text-[10px]">{b.severity}</span>
              </div>
              <p className="text-text-secondary mt-0.5">{b.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
