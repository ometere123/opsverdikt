'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { createOperationsCase } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import { DEMO_CASE } from '@/lib/demo-data';
import { WalletIdentityPlate } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Zap, Loader2 } from 'lucide-react';

export default function NewCasePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    case_id: '',
    case_title: '',
    facility_name: '',
    facility_type: '',
    shift_name: '',
    business_objective: '',
    current_pressure_level: 'HIGH',
    shift_start_time: '',
    shift_end_time: '',
    decision_deadline: '',
    available_workers: '',
    worker_skill_summary: '',
    equipment_constraints: '',
    supervisor_notes: '',
    current_operational_hypothesis: '',
  });

  function loadDemo() {
    setForm({ ...DEMO_CASE });
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { setError('Connect wallet first'); return; }
    if (!form.case_id || !form.case_title || !form.facility_name || !form.business_objective || !form.available_workers) {
      setError('Fill all required fields'); return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const hash = await createOperationsCase(address, form);
      if (hash) saveTxHash(form.case_id, 'case', hash as string);
      router.push(`/ops/${form.case_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Transaction failed');
    } finally {
      setSubmitting(false);
    }
  }

  const fields: Array<{ key: string; label: string; required?: boolean; multiline?: boolean; options?: string[] }> = [
    { key: 'case_id', label: 'Case ID', required: true },
    { key: 'case_title', label: 'Case Title', required: true },
    { key: 'facility_name', label: 'Facility Name', required: true },
    { key: 'facility_type', label: 'Facility Type' },
    { key: 'shift_name', label: 'Shift Name' },
    { key: 'business_objective', label: 'Business Objective', required: true, multiline: true },
    { key: 'current_pressure_level', label: 'Pressure Level', options: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
    { key: 'shift_start_time', label: 'Shift Start Time' },
    { key: 'shift_end_time', label: 'Shift End Time' },
    { key: 'decision_deadline', label: 'Decision Deadline' },
    { key: 'available_workers', label: 'Available Workers', required: true },
    { key: 'worker_skill_summary', label: 'Worker Skill Summary', multiline: true },
    { key: 'equipment_constraints', label: 'Equipment Constraints', multiline: true },
    { key: 'supervisor_notes', label: 'Supervisor Notes', multiline: true },
    { key: 'current_operational_hypothesis', label: 'Operational Hypothesis', multiline: true },
  ];

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-steel hover:text-text-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
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
          <button
            onClick={loadDemo}
            className="text-xs font-mono text-electric-blue hover:text-electric-blue/80 border border-electric-blue/30 rounded px-3 py-1.5"
          >
            <Zap className="w-3 h-3 inline mr-1" />LOAD DEMO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                {field.label} {field.required && <span className="text-critical-red">*</span>}
              </label>
              {field.options ? (
                <select
                  value={(form as Record<string, string>)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50"
                >
                  {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.multiline ? (
                <textarea
                  value={(form as Record<string, string>)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  rows={3}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={(form as Record<string, string>)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full bg-panel-steel border border-border-line rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-signal-amber/50"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="text-sm text-critical-red bg-critical-red/10 border border-critical-red/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isConnected}
            className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting to Contract...</> : 'Submit Operations Case'}
          </button>
        </form>
      </div>
    </div>
  );
}
