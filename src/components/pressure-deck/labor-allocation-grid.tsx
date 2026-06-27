'use client';

import { Users } from 'lucide-react';

interface Allocation {
  role: string;
  count: number;
  zone: string;
}

export function LaborAllocationGrid({ allocations }: { allocations: Allocation[] }) {
  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-fatigue-violet" />
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Labor Allocation</h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {allocations.map((a, i) => (
          <div key={i} className="bg-deep-console rounded px-2 py-1.5 text-xs">
            <div className="font-mono text-lg font-bold text-text-primary">{a.count}</div>
            <div className="text-text-secondary">{a.role}</div>
            <div className="text-[10px] text-muted-steel">{a.zone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
