'use client';

import { cn } from '@/lib/utils';
import type { ZoneData } from './facility-pressure-map';
import { AlertTriangle, FileText, Users } from 'lucide-react';

const pressureColors: Record<string, string> = {
  LOW: 'border-system-green/30 bg-system-green/5',
  MODERATE: 'border-electric-blue/30 bg-electric-blue/5',
  HIGH: 'border-signal-amber/30 bg-signal-amber/5 glow-amber',
  CRITICAL: 'border-critical-red/30 bg-critical-red/5 glow-red',
};

const pressureTextColors: Record<string, string> = {
  LOW: 'text-system-green',
  MODERATE: 'text-electric-blue',
  HIGH: 'text-signal-amber',
  CRITICAL: 'text-critical-red',
};

export function OperationsZonePanel({ zone }: { zone: ZoneData }) {
  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all duration-300',
      pressureColors[zone.pressure] ?? pressureColors.LOW,
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-semibold text-text-primary">{zone.name}</h3>
        <span className={cn('font-mono text-[10px] font-bold uppercase', pressureTextColors[zone.pressure])}>
          {zone.pressure}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <FileText className="w-3 h-3" />
          <span>{zone.taskCount} tasks</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <Users className="w-3 h-3" />
          <span>{zone.workerAllocation} workers</span>
        </div>
        {zone.blockers > 0 && (
          <div className="flex items-center gap-1 text-signal-amber col-span-2">
            <AlertTriangle className="w-3 h-3" />
            <span>{zone.blockers} blockers</span>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px]">
        <span className={cn('font-mono', pressureTextColors[zone.riskState] ?? 'text-muted-steel')}>
          RISK: {zone.riskState}
        </span>
        {zone.evidenceCount > 0 && (
          <span className="text-evidence-white">· {zone.evidenceCount} evidence</span>
        )}
      </div>
    </div>
  );
}
