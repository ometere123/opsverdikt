'use client';

import type { LaborPlanOption } from '@/lib/types';
import { LaborPlanTradeoffCard } from './labor-plan-tradeoff-card';

export function DecisionStack({
  plans,
  recommendedPlanId,
}: {
  plans: LaborPlanOption[];
  recommendedPlanId?: string;
}) {
  return (
    <div className="w-80 flex-shrink-0 bg-dark-graphite border-l border-border-line flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-border-line">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          Decision Stack
        </h2>
        <p className="text-xs text-muted-steel mt-0.5">Labor plan tradeoffs</p>
      </div>
      <div className="p-3 space-y-3 flex-1">
        {plans.length === 0 ? (
          <p className="text-xs text-muted-steel text-center py-8">No labor plans submitted yet</p>
        ) : (
          plans.map((plan) => (
            <LaborPlanTradeoffCard
              key={plan.plan_id}
              plan={plan}
              isRecommended={plan.plan_id === recommendedPlanId}
            />
          ))
        )}
      </div>
    </div>
  );
}
