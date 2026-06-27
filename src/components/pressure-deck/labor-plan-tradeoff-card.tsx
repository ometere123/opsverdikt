'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, Target } from 'lucide-react';

export function LaborPlanTradeoffCard({
  plan,
  isRecommended = false,
}: {
  plan: any;
  isRecommended?: boolean;
}) {
  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all duration-300',
      isRecommended
        ? 'border-system-green/50 bg-system-green/5 glow-green'
        : 'border-border-line bg-panel-steel/50 hover:border-border-line/80',
    )}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-display text-sm font-semibold text-text-primary leading-tight">
          {plan.plan_title}
        </h3>
        {isRecommended && (
          <CheckCircle className="w-4 h-4 text-system-green flex-shrink-0 mt-0.5" />
        )}
      </div>

      <p className="text-xs text-text-secondary mb-2">{plan.labor_allocation_summary}</p>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-start gap-1.5">
          <Target className="w-3 h-3 text-system-green mt-0.5 flex-shrink-0" />
          <span className="text-text-secondary"><span className="text-system-green">Upside:</span> {plan.expected_upside}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 text-signal-amber mt-0.5 flex-shrink-0" />
          <span className="text-text-secondary"><span className="text-signal-amber">Risk:</span> {plan.key_operational_risks}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border-line/50 grid grid-cols-2 gap-1 text-[10px] text-muted-steel">
        <span>SLA: {plan.SLA_assumptions?.slice(0, 40)}...</span>
        <span>Bottleneck: {plan.bottleneck_assumptions?.slice(0, 40)}...</span>
      </div>

      {plan.failure_conditions && (
        <div className="mt-1.5 text-[10px] text-critical-red/80">
          Fail if: {plan.failure_conditions}
        </div>
      )}
    </div>
  );
}
