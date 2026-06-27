'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { addEvidence } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import { PublicEvidenceWarning } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Zap, Loader2, Plus, Trash2 } from 'lucide-react';

const DEMO_EVIDENCE = [
  { title: 'Real-time order queue export', evidence_type: 'DATA_EXPORT', url: 'https://example.com/northdock/orders/export-evening', evidence_hash: 'e1f2a3b4c5d6', source_name: 'NorthDock WMS', source_credibility: 'Direct system export, high reliability', relevance: 'Shows exact premium order count and deadlines', related_task_ids: '0,4', related_plan_ids: '0,1', category: 'ORDER_DATA' },
  { title: 'Blocked SKU inventory report', evidence_type: 'INVENTORY_REPORT', url: 'https://example.com/northdock/inventory/blocked-skus', evidence_hash: 'f7g8h9i0j1k2', source_name: 'NorthDock Inventory System', source_credibility: 'System-generated, updated 15 minutes ago', relevance: 'Confirms replenishment queue is blocked by 8 SKUs', related_task_ids: '1', related_plan_ids: '1,2', category: 'INVENTORY_DATA' },
  { title: 'Carrier cutoff schedule', evidence_type: 'CARRIER_SCHEDULE', url: 'https://example.com/northdock/carriers/cutoff-schedule', evidence_hash: 'l3m4n5o6p7q8', source_name: 'Carrier Portal', source_credibility: 'Official carrier schedule, confirmed today', relevance: 'Premium carrier departs in 90 minutes, no flexibility', related_task_ids: '0,3', related_plan_ids: '0,1', category: 'CARRIER_DATA' },
];

const emptyEvidence = { title: '', evidence_type: '', url: '', evidence_hash: '', source_name: '', source_credibility: '', relevance: '', related_task_ids: '', related_plan_ids: '', category: '' };

export default function EvidencePage() {
  const { caseId } = useParams() as { caseId: string };
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState([{ ...emptyEvidence }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  function loadDemo() { setItems(DEMO_EVIDENCE.map((e) => ({ ...e }))); }
  function addRow() { setItems((i) => [...i, { ...emptyEvidence }]); }
  function removeRow(i: number) { setItems((items) => items.filter((_, idx) => idx !== i)); }
  function update(i: number, k: string, v: string) { setItems((items) => items.map((item, idx) => idx === i ? { ...item, [k]: v } : item)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { setError('Connect wallet to continue'); return; }
    setSubmitting(true); setError(null);
    try {
      for (let i = 0; i < items.length; i++) {
        setProgress(i + 1);
        const hash = await addEvidence(address, { case_id: Number(caseId), ...items[i] });
        if (i === 0 && hash) saveTxHash(caseId, 'evidence', hash as string);
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
          <span className="font-display text-sm font-bold text-text-primary">Evidence Registry</span>
          <span className="font-mono text-[10px] text-muted-steel">#{caseId}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadDemo} className="text-xs font-mono text-electric-blue border border-electric-blue/30 rounded px-3 py-1.5"><Zap className="w-3 h-3 inline mr-1" />LOAD DEMO ({DEMO_EVIDENCE.length})</button>
          <button onClick={addRow} className="text-xs text-system-green border border-system-green/30 rounded px-3 py-1.5"><Plus className="w-3 h-3 inline mr-1" />Add Evidence</button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <PublicEvidenceWarning />
        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-panel-steel/30 border border-border-line rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-steel">Evidence {i + 1}</span>
                {items.length > 1 && <button type="button" onClick={() => removeRow(i)} className="text-critical-red/60 hover:text-critical-red"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} className={k === 'relevance' || k === 'source_credibility' ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] text-muted-steel uppercase mb-0.5">{k.replace(/_/g, ' ')}</label>
                    <input type="text" value={v} onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-deep-console border border-border-line rounded px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-signal-amber/50" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {error && <div className="text-sm text-critical-red bg-critical-red/10 border border-critical-red/30 rounded-md px-3 py-2">{error}</div>}
          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting {progress}/{items.length}...</> : `Submit ${items.length} Evidence Record${items.length > 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
}
