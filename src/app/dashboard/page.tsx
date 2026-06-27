'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listOperationsCases } from '@/lib/contract-service';
import { WalletIdentityPlate, ContractStatusPanel, GlowAlertFrame } from '@/components/pressure-deck';
import { Shield, Plus, FileText, Zap, CheckCircle, AlertTriangle, Clock, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseSummary {
  case_id: string;
  case_title: string;
  facility_name: string;
  case_status: string;
  review_status: string;
  final_verdict_label: string;
  current_pressure_level: string;
  created_at: string;
}

const pressureColors: Record<string, string> = {
  LOW: 'text-system-green',
  MODERATE: 'text-electric-blue',
  HIGH: 'text-signal-amber',
  CRITICAL: 'text-critical-red',
};

export default function DashboardPage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      setLoading(true);
      const data = await listOperationsCases();
      setCases(data);
    } catch (e) {
      setError('Could not load cases from contract');
    } finally {
      setLoading(false);
    }
  }

  const totalCases = cases.length;
  const reviewReady = cases.filter(c =>
    c.review_status === 'NOT_STARTED' &&
    ['EVIDENCE_REGISTERED', 'PLANS_REGISTERED', 'TASKS_REGISTERED', 'SNAPSHOT_REGISTERED'].includes(c.case_status)
  ).length;
  const underReview = cases.filter(c => c.review_status === 'CONSENSUS_PENDING').length;
  const verdictsIssued = cases.filter(c => c.review_status === 'VERDICT_READY').length;
  const criticalPriority = cases.filter(c => c.current_pressure_level === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-floor-black">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-signal-amber" />
            <span className="font-display text-base font-bold text-text-primary">OpsVerdikt</span>
          </Link>
          <span className="text-xs font-mono text-muted-steel">COMMAND DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/ops/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-signal-amber text-floor-black text-xs font-bold hover:bg-signal-amber/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Case
          </Link>
          <WalletIdentityPlate />
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Cases', value: totalCases, icon: FileText, color: 'text-electric-blue' },
            { label: 'Review Ready', value: reviewReady, icon: Clock, color: 'text-signal-amber' },
            { label: 'Under Review', value: underReview, icon: Radio, color: 'text-electric-blue' },
            { label: 'Verdikts Issued', value: verdictsIssued, icon: CheckCircle, color: 'text-system-green' },
            { label: 'Critical Priority', value: criticalPriority, icon: AlertTriangle, color: 'text-critical-red' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-panel-steel rounded-lg border border-border-line p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('w-4 h-4', color)} />
                <span className="text-xs text-muted-steel uppercase tracking-wider">{label}</span>
              </div>
              <span className={cn('font-mono text-2xl font-bold', color)}>{value}</span>
            </div>
          ))}
        </div>

        {/* Contract Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ContractStatusPanel />
        </div>

        {/* Cases list */}
        <div className="bg-dark-graphite rounded-lg border border-border-line">
          <div className="p-4 border-b border-border-line flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Operations Cases
            </h2>
            <button onClick={loadCases} className="text-xs text-electric-blue hover:text-electric-blue/80 font-mono">
              REFRESH
            </button>
          </div>

          {loading && (
            <div className="p-8 text-center text-muted-steel text-sm">Loading cases from contract...</div>
          )}

          {error && (
            <div className="p-8 text-center text-critical-red text-sm">{error}</div>
          )}

          {!loading && !error && cases.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-steel text-sm mb-3">No operations cases found</p>
              <Link
                href="/ops/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-signal-amber text-floor-black text-xs font-bold hover:bg-signal-amber/90"
              >
                <Plus className="w-3.5 h-3.5" /> Create First Case
              </Link>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <div className="divide-y divide-border-line">
              {cases.map((c) => (
                <Link
                  key={c.case_id}
                  href={`/ops/${c.case_id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-panel-steel/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary truncate">{c.case_title}</span>
                      <span className={cn('font-mono text-[10px] font-bold', pressureColors[c.current_pressure_level])}>
                        {c.current_pressure_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-steel mt-0.5">
                      <span>{c.facility_name}</span>
                      <span className="font-mono">{c.case_id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="font-mono text-[10px] text-muted-steel">{c.case_status}</span>
                    {c.review_status === 'VERDICT_READY' && (
                      <span className="font-mono text-[10px] text-system-green">{c.final_verdict_label}</span>
                    )}
                    {c.review_status === 'CONSENSUS_PENDING' && (
                      <span className="font-mono text-[10px] text-signal-amber animate-pulse">REVIEWING...</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
