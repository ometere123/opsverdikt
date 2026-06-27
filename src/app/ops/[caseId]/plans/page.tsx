'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { addLaborPlan } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import { Shield, ArrowLeft, Zap, Loader2, Plus, Trash2 } from 'lucide-react';

const DEMO_PLANS = [
  { title: 'Full Outbound Push', allocation_summary: 'All 7 workers to outbound picking and staging', workers_by_function: '6 pickers, 1 dock staging', priority_task_order: 'Premium outbound → cold-chain → standard outbound → dock staging', tasks_to_delay: 'Replenishment, exceptions, inbound sorting', expected_upside: 'Maximum chance of meeting premium carrier cutoff', operational_risks: 'Replenishment queue stays blocked, next picking wave collapses', bottleneck_assumptions: 'Assumes blocked SKUs do not affect current wave', sla_assumptions: 'Assumes all premium orders can be picked in 90 minutes', safety_assumptions: 'Workers may fatigue by hour 6 without rotation', failure_conditions: 'If blocked SKUs affect current wave, picking stalls mid-shift' },
  { title: 'Bottleneck-Aware Split', allocation_summary: '4 workers to outbound, 1 to replenishment, 1 to exceptions, 1 to dock', workers_by_function: '4 pickers, 1 replenishment, 1 exception handler, 1 dock staging', priority_task_order: 'Premium outbound + replenishment unblock simultaneously → cold-chain → exceptions → dock', tasks_to_delay: 'Low-priority inbound sorting, cycle counts, non-urgent staging cleanup', expected_upside: 'Protects near-term SLA while preventing next-wave collapse', operational_risks: 'Fewer pickers on outbound, slightly higher risk of cutoff miss', bottleneck_assumptions: 'Blocked SKUs will affect next wave if not resolved now', sla_assumptions: '4 pickers can handle premium volume in 90 minutes', safety_assumptions: 'Workload is distributed, fatigue risk is lower', failure_conditions: 'If premium volume exceeds 4-picker capacity, cutoff is missed' },
  { title: 'Replenishment First', allocation_summary: '3 workers to replenishment, 2 to outbound, 1 to cold-chain, 1 to dock', workers_by_function: '3 replenishment, 2 pickers, 1 cold-chain, 1 dock', priority_task_order: 'Replenishment unblock → cold-chain → premium outbound → dock', tasks_to_delay: 'Exceptions, standard outbound, inbound', expected_upside: 'Prevents total next-wave collapse, protects cold-chain', operational_risks: 'Premium carrier cutoff almost certainly missed', bottleneck_assumptions: 'Replenishment is the true bottleneck, not picking speed', sla_assumptions: 'Accepts premium SLA breach to protect operational continuity', safety_assumptions: 'Heavy replenishment work may cause fatigue', failure_conditions: 'Premium customers escalate, carrier relationship damaged' },
];

const emptyPlan = { title: '', allocation_summary: '', workers_by_function: '', priority_task_order: '', tasks_to_delay: '', expected_upside: '', operational_risks: '', bottleneck_assumptions: '', sla_assumptions: '', safety_assumptions: '', failure_conditions: '' };

export default function PlansPage() {
  const { caseId } = useParams() as { caseId: string };
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [plans, setPlans] = useState([{ ...emptyPlan }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  function loadDemo() { setPlans(DEMO_PLANS.map((p) => ({ ...p }))); }
  function addRow() { setPlans((p) => [...p, { ...emptyPlan }]); }
  function removeRow(i: number) { setPlans((p) => p.filter((_, idx) => idx !== i)); }
  function update(i: number, k: string, v: string) { setPlans((p) => p.map((plan, idx) => idx === i ? { ...plan, [k]: v } : plan)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { setError('Connect wallet to continue'); return; }
    setSubmitting(true); setError(null);
    try {
      for (let i = 0; i < plans.length; i++) {
        setProgress(i + 1);
        const hash = await addLaborPlan(address, { case_id: Number(caseId), ...plans[i] });
        if (i === 0 && hash) saveTxHash(caseId, 'plans', hash as string);
      }
      router.push(`/ops/${caseId}`);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setSubmitting(false); setProgress(0); }
  }

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
          <Shield className="w-4 h-4 text-signal-amber" />
          <span className="font-display text-sm font-bold text-text-primary">Labor Plan Options</span>
          <span className="font-mono text-[10px] text-muted-steel">#{caseId}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadDemo} className="text-xs font-mono text-electric-blue border border-electric-blue/30 rounded px-3 py-1.5"><Zap className="w-3 h-3 inline mr-1" />LOAD DEMO ({DEMO_PLANS.length})</button>
          <button onClick={addRow} className="text-xs text-system-green border border-system-green/30 rounded px-3 py-1.5"><Plus className="w-3 h-3 inline mr-1" />Add Plan</button>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-4">
        {plans.map((plan, i) => (
          <div key={i} className="bg-panel-steel/30 border border-border-line rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-steel">Plan {i + 1}</span>
              {plans.length > 1 && <button type="button" onClick={() => removeRow(i)} className="text-critical-red/60 hover:text-critical-red"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(plan).map(([k, v]) => (
                <div key={k} className={k.includes('summary') || k.includes('assumptions') || k.includes('conditions') || k.includes('risks') || k.includes('upside') ? 'md:col-span-2' : ''}>
                  <label className="block text-[10px] text-muted-steel uppercase mb-0.5">{k.replace(/_/g, ' ')}</label>
                  {k.includes('summary') || k.includes('assumptions') || k.includes('conditions') || k.includes('risks') || k.includes('upside') ? (
                    <textarea value={v} onChange={(e) => update(i, k, e.target.value)} rows={2}
                      className="w-full bg-deep-console border border-border-line rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-signal-amber/50 resize-none" />
                  ) : (
                    <input type="text" value={v} onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-deep-console border border-border-line rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-signal-amber/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {error && <div className="text-sm text-critical-red bg-critical-red/10 border border-critical-red/30 rounded-md px-3 py-2">{error}</div>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting {progress}/{plans.length}...</> : `Submit ${plans.length} Plan${plans.length > 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}
