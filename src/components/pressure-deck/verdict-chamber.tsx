'use client';

import { cn } from '@/lib/utils';
import { RiskBand } from './risk-band';
import { ConsensusMeter } from './consensus-meter';
import { ExplorerAuditLink } from './explorer-audit-link';
import { Shield, AlertTriangle, CheckCircle, Target, FileWarning } from 'lucide-react';

export function VerdictChamber({
  verdict,
  txHash,
}: {
  verdict: Record<string, any> | null;
  txHash?: string;
}) {
  if (!verdict) {
    return (
      <div className="bg-deep-console border-t border-border-line p-8 text-center">
        <Shield className="w-8 h-8 text-muted-steel mx-auto mb-2" />
        <p className="font-display text-sm text-muted-steel">Verdikt Chamber — Awaiting Consensus</p>
        <p className="text-xs text-muted-steel/70 mt-1">Submit all case data and request consensus review</p>
      </div>
    );
  }

  return (
    <div className="bg-deep-console border-t-2 border-system-green/50 glow-green">
      <div className="p-4 border-b border-border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-system-green" />
          <div>
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
              Ops Verdikt Chamber
            </h2>
            <p className="text-xs text-system-green">Canonical consensus verdict issued</p>
          </div>
        </div>
        {txHash && <ExplorerAuditLink txHash={txHash} />}
      </div>

      <div className="p-4 space-y-4">
        {/* Verdict Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-steel uppercase">Verdict Label</span>
            <h3 className="font-display text-xl font-bold text-system-green">{verdict.verdict_label}</h3>
          </div>
          <ConsensusMeter score={verdict.confidence_score} />
        </div>

        {/* Recommended Plan */}
        <div className="bg-panel-steel/50 rounded-lg border border-system-green/20 p-3">
          <span className="text-xs text-muted-steel uppercase">Recommended Plan</span>
          <p className="font-mono text-sm text-text-primary mt-0.5">{verdict.recommended_plan_id}</p>
        </div>

        {/* Risk Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <RiskBand label="Priority" level={verdict.priority_level} />
          <RiskBand label="SLA Risk" level={verdict.SLA_risk_level} />
          <RiskBand label="Bottleneck Risk" level={verdict.bottleneck_risk_level} />
          <RiskBand label="Execution Risk" level={verdict.execution_risk_level} />
          <RiskBand label="Safety Risk" level={verdict.safety_risk_level} />
          <RiskBand label="Labor Fit" level={verdict.labor_fit_level} />
          <RiskBand label="Evidence Quality" level={verdict.evidence_quality_level} />
          <RiskBand label="Contradiction" level={verdict.contradiction_level} />
        </div>

        {/* Labor Allocation */}
        <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
          <span className="text-xs text-muted-steel uppercase flex items-center gap-1">
            <Target className="w-3 h-3" /> Recommended Labor Allocation
          </span>
          <p className="text-sm text-text-primary mt-1">{verdict.recommended_labor_allocation}</p>
        </div>

        {/* Priority Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
            <span className="text-xs text-signal-amber uppercase">Top Priority Tasks</span>
            <p className="text-xs text-text-secondary mt-1">{verdict.top_priority_tasks}</p>
          </div>
          <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
            <span className="text-xs text-muted-steel uppercase">Tasks to Delay</span>
            <p className="text-xs text-text-secondary mt-1">{verdict.tasks_to_delay}</p>
          </div>
        </div>

        {/* Supervisor Action */}
        {verdict.supervisor_action_required && (
          <div className="bg-signal-amber/10 rounded-lg border border-signal-amber/30 p-3 glow-amber">
            <span className="text-xs text-signal-amber uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Supervisor Action Required
            </span>
            <p className="text-sm text-text-primary mt-1">{verdict.supervisor_action_required}</p>
          </div>
        )}

        {/* Reasoning */}
        <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
          <span className="text-xs text-muted-steel uppercase">Reasoning Summary</span>
          <p className="text-sm text-text-secondary mt-1">{verdict.short_reasoning_summary}</p>
        </div>

        {/* Evidence & Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
            <span className="text-xs text-electric-blue uppercase">Supporting Evidence</span>
            <p className="text-xs text-text-secondary mt-1">{verdict.key_supporting_evidence}</p>
          </div>
          <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
            <span className="text-xs text-critical-red/80 uppercase">Key Concerns</span>
            <p className="text-xs text-text-secondary mt-1">{verdict.key_concerns}</p>
          </div>
          <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
            <span className="text-xs text-cold-chain-cyan uppercase">Follow-up Needed</span>
            <p className="text-xs text-text-secondary mt-1">{verdict.follow_up_operational_evidence_needed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
