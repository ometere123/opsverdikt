'use client';

import { PressureGauge } from './pressure-gauge';
import { CarrierCutoffTimer } from './carrier-cutoff-timer';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, Clock, Radio, Shield, Users, Zap } from 'lucide-react';

interface PressureRailProps {
  pressureLevel: string;
  slaRisk: string;
  bottleneckRisk: string;
  workerCount: string;
  carrierCutoffMinutes?: number;
  consensusStatus: string;
  contractStatus: string;
  workerFeedStatus: string;
}

function StatusDot({ status, label }: { status: string; label: string }) {
  const isActive = status === 'ACTIVE' || status === 'LIVE' || status === 'CONNECTED' || status === 'VERDICT_READY';
  const isPending = status === 'CONSENSUS_PENDING' || status === 'PENDING';
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-2 h-2 rounded-full',
        isActive ? 'bg-system-green' : isPending ? 'bg-signal-amber animate-pulse' : 'bg-muted-steel',
      )} />
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="ml-auto font-mono text-xs text-muted-steel">{status}</span>
    </div>
  );
}

export function PressureRail({
  pressureLevel, slaRisk, bottleneckRisk, workerCount,
  carrierCutoffMinutes, consensusStatus, contractStatus, workerFeedStatus,
}: PressureRailProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-dark-graphite border-r border-border-line flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-border-line">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-signal-amber" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
            Pressure Rail
          </h2>
        </div>
        <p className="text-xs text-muted-steel">Live operational state</p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        <PressureGauge level={pressureLevel} label="Shift Pressure" />
        <PressureGauge level={slaRisk} label="SLA Risk" />
        <PressureGauge level={bottleneckRisk} label="Bottleneck Risk" />

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Workers Available</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-electric-blue" />
            <span className="font-mono text-lg font-bold text-text-primary">{workerCount}</span>
          </div>
        </div>

        {carrierCutoffMinutes !== undefined && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Carrier Cutoff</span>
            <CarrierCutoffTimer minutes={carrierCutoffMinutes} />
          </div>
        )}

        <div className="border-t border-border-line pt-4 space-y-2.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">System Status</span>
          <StatusDot status={consensusStatus} label="Consensus" />
          <StatusDot status={contractStatus} label="Contract" />
          <StatusDot status={workerFeedStatus} label="Worker Feed" />
        </div>
      </div>
    </aside>
  );
}
