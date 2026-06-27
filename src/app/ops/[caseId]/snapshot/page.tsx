'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { addShiftSnapshot } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import { DEMO_SNAPSHOT } from '@/lib/demo-data';
import { Shield, ArrowLeft, Zap, Loader2 } from 'lucide-react';

export default function SnapshotPage() {
  const { caseId } = useParams() as { caseId: string };
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    snapshot_id: '', snapshot_title: '', facility_zone_summary: '',
    active_orders_summary: '', staffing_summary: '', equipment_status: '',
    current_bottlenecks: '', carrier_cutoff_summary: '', SLA_pressure_summary: '',
    safety_or_fatigue_notes: '', source_url: '', source_hash: '',
  });

  function loadDemo() {
    setForm({ ...DEMO_SNAPSHOT });
  }

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { setError('Connect wallet'); return; }
    setSubmitting(true); setError(null);
    try {
      const hash = await addShiftSnapshot(address, { case_id: caseId, ...form });
      if (hash) saveTxHash(caseId, 'snapshot', hash as string);
      router.push(`/ops/${caseId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setSubmitting(false); }
  }

  const fields = [
    { key: 'snapshot_id', label: 'Snapshot ID' },
    { key: 'snapshot_title', label: 'Snapshot Title' },
    { key: 'facility_zone_summary', label: 'Facility Zone Summary', multi: true },
    { key: 'active_orders_summary', label: 'Active Orders Summary', multi: true },
    { key: 'staffing_summary', label: 'Staffing Summary', multi: true },
    { key: 'equipment_status', label: 'Equipment Status', multi: true },
    { key: 'current_bottlenecks', label: 'Current Bottlenecks', multi: true },
    { key: 'carrier_cutoff_summary', label: 'Carrier Cutoff Summary', multi: true },
    { key: 'SLA_pressure_summary', label: 'SLA Pressure Summary', multi: true },
    { key: 'safety_or_fatigue_notes', label: 'Safety / Fatigue Notes', multi: true },
    { key: 'source_url', label: 'Source URL' },
    { key: 'source_hash', label: 'Source Hash' },
  ];

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
          <Shield className="w-4 h-4 text-signal-amber" />
          <span className="font-display text-sm font-bold text-text-primary">Add Shift Snapshot</span>
          <span className="font-mono text-[10px] text-muted-steel">{caseId}</span>
        </div>
        <button onClick={loadDemo} className="text-xs font-mono text-electric-blue border border-electric-blue/30 rounded px-3 py-1.5">
          <Zap className="w-3 h-3 inline mr-1" />LOAD DEMO
        </button>
      </header>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-4">
        {fields.map(({ key, label, multi }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">{label}</label>
            {multi ? (
              <textarea value={(form as Record<string,string>)[key]} onChange={(e) => update(key, e.target.value)} rows={2}
                className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50 resize-none" />
            ) : (
              <input type="text" value={(form as Record<string,string>)[key]} onChange={(e) => update(key, e.target.value)}
                className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50" />
            )}
          </div>
        ))}
        {error && <div className="text-sm text-critical-red bg-critical-red/10 border border-critical-red/30 rounded-md px-3 py-2">{error}</div>}
        <button type="submit" disabled={submitting || !isConnected}
          className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Register Shift Snapshot'}
        </button>
      </form>
    </div>
  );
}
