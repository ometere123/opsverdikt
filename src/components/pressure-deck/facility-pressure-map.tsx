'use client';

import { cn } from '@/lib/utils';
import { FACILITY_ZONES } from '@/lib/constants';
import { OperationsZonePanel } from './operations-zone-panel';

export interface ZoneData {
  name: string;
  pressure: string;
  taskCount: number;
  blockers: number;
  workerAllocation: number;
  riskState: string;
  slaImpact: string;
  evidenceCount: number;
}

const defaultZones: ZoneData[] = FACILITY_ZONES.map((name) => ({
  name,
  pressure: 'LOW',
  taskCount: 0,
  blockers: 0,
  workerAllocation: 0,
  riskState: 'STABLE',
  slaImpact: 'NONE',
  evidenceCount: 0,
}));

export function FacilityPressureMap({ zones = defaultZones }: { zones?: ZoneData[] }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 border-b border-border-line">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          Facility Pressure Map
        </h2>
        <p className="text-xs text-muted-steel mt-0.5">Operational decision zones</p>
      </div>
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {zones.map((zone) => (
          <OperationsZonePanel key={zone.name} zone={zone} />
        ))}
      </div>
    </div>
  );
}
