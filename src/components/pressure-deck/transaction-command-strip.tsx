'use client';

import { ExplorerAuditLink } from './explorer-audit-link';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface TimelineStep {
  label: string;
  txHash?: string;
  status: 'completed' | 'pending' | 'active';
}

export function TransactionCommandStrip({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
        Transaction Trail
      </h3>
      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {step.status === 'completed' ? (
              <CheckCircle className="w-3.5 h-3.5 text-system-green flex-shrink-0" />
            ) : step.status === 'active' ? (
              <Loader2 className="w-3.5 h-3.5 text-signal-amber animate-spin flex-shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted-steel flex-shrink-0" />
            )}
            <span className={step.status === 'completed' ? 'text-text-primary' : 'text-muted-steel'}>
              {step.label}
            </span>
            {step.txHash && (
              <span className="ml-auto">
                <ExplorerAuditLink txHash={step.txHash} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
