'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { createCase, getCaseCount } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import { WalletIdentityPlate } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Zap, Loader2 } from 'lucide-react';

const DEMO = {
  title: 'Evening Outbound Pressure - NorthDock Hub',
  facility_name: 'NorthDock Fulfillment Hub',
  facility_type: 'E-commerce fulfillment centre',
  shift_name: 'Evening outbound pressure shift',
  business_objective: 'Protect premium carrier cutoff while preventing next-wave replenishment collapse',
  pressure_level: 3,
  shift_start: '16:00',
  shift_end: '22:00',
  decision_deadline: '90 minutes before carrier cutoff',
  available_workers: 7,
  worker_skill_summary: '4 pickers, 1 replenishment-trained worker, 1 exception handler, 1 dock staging lead',
  equipment_constraints: '2 working pallet jacks, 1 scanner pool degraded, cold-chain staging area near capacity',
  supervisor_notes: 'Outbound queue is late, but blocked SKUs may stall the next wave.',
  operational_hypothesis: 'A pure outbound push may protect immediate SLAs but create a hidden replenishment failure.',
};

const PRESSURE_OPTIONS = [
  { value: 0, label: 'LOW' },
  { value: 1, label: 'MODERATE' },
  { value: 2, label: 'HIGH' },
  { value: 3, label: 'CRITICAL' },
];

export default function NewCasePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    facility_name: '',
    facility_type: '',
    shift_name: '',
    business_objective: '',
    pressure_level: 2,
    shift_start: '',
    shift_end: '',
    decision_deadline: '',
    available_workers: 1,
    worker_skill_summary: '',
    equipment_constraints: '',
    supervisor_notes: '',
    operational_hypothesis: '',
  });

  function loadDemo() { setForm({ ...DEMO }); }
  function update(field: string, value: string | number) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { setError('Connect wallet to continue'); return; }
    if (!form.title || !form.facility_name || !form.business_objective) {
      setError('Fill all required fields'); return;
    }
    setSubmitting(true); setError(null);
    try {
      const currentCount = await getCaseCount();
      const newCaseId = currentCount + 1;
      const hash = await createCase(address, form);
      if (hash) saveTxHash(String(newCaseId), 'case', hash as string);
      router.push(`/ops/${newCaseId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Transaction failed');
    } finally { setSubmitting(false); }
  }

  const fields: Array<{ key: string; label: string; required?: boolean; multiline?: boolean; type?: string }> = [
    { key: 'title', label: 'Case Title', required: true },
    { key: 'facility_name', label: 'Facility Name', required: true },
    { key: 'facility_type', label: 'Facility Type' },
    { key: 'shift_name', label: 'Shift Name' },
    { key: 'business_objective', label: 'Business Objective', required: true, multiline: true },
    { key: 'pressure_level', label: 'Pressure Level', type: 'select' },
    { key: 'shift_start', label: 'Shift Start Time' },
    { key: 'shift_end', label: 'Shift End Time' },
    { key: 'decision_deadline', label: 'Decision Deadline' },
    { key: 'available_workers', label: 'Available Workers', required: true, type: 'number' },
    { key: 'worker_skill_summary', label: 'Worker Skill Summary', multiline: true },
    { key: 'equipment_constraints', label: 'Equipment Constraints', multiline: true },
    { key: 'supervisor_notes', label: 'Supervisor Notes', multiline: true },
    { key: 'operational_hypothesis', label: 'Operational Hypothesis', multiline: true },
  ];

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
          <Shield className="w-5 h-5 text-signal-amber" />
          <span className="font-display text-base font-bold text-text-primary">New Operations Case</span>
        </div>
        <WalletIdentityPlate />
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl font-bold text-text-primary">Create Operations Case</h1>
            <p className="text-xs text-muted-steel mt-1">Define the operational pressure scenario for consensus evaluation</p>
          </div>
          <button onClick={loadDemo}
            className="text-xs font-mono text-electric-blue hover:text-electric-blue/80 border border-electric-blue/30 rounded px-3 py-1.5">
            <Zap className="w-3 h-3 inline mr-1" />LOAD DEMO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                {field.label} {field.required && <span className="text-critical-red">*</span>}
              </label>
              {field.type === 'select' ? (
                <select value={(form as any)[field.key]}
                  onChange={(e) => update(field.key, Number(e.target.value))}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50">
                  {PRESSURE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : field.type === 'number' ? (
                <input type="number" value={(form as any)[field.key]}
                  onChange={(e) => update(field.key, Number(e.target.value))}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50" />
              ) : field.multiline ? (
                <textarea value={(form as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)} rows={3}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50 resize-none" />
              ) : (
                <input type="text" value={(form as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50" />
              )}
            </div>
          ))}

          {error && (
            <div className="text-sm text-critical-red bg-critical-red/10 border border-critical-red/30 rounded-md px-3 py-2">{error}</div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting to Contract...</> : 'Submit Operations Case'}
          </button>
        </form>
      </div>
    </div>
  );
}
