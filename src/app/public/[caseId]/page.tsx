'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOperationsCase } from '@/lib/contract-service';
import type { FullCaseData } from '@/lib/types';
import { VerdictChamber, EvidenceSignalBay, TaskSeverityStack, PressureGauge } from '@/components/pressure-deck';
import { Shield, Loader2 } from 'lucide-react';

export default function PublicCasePage() {
  const { caseId } = useParams() as { caseId: string };
  const [data, setData] = useState<FullCaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOperationsCase(caseId).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-floor-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-signal-amber animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-floor-black flex items-center justify-center">
        <p className="text-muted-steel">Case not found</p>
      </div>
    );
  }

  const c = data.case;

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border-line bg-dark-graphite">
        <Shield className="w-5 h-5 text-signal-amber" />
        <span className="font-display text-base font-bold text-text-primary">OpsVerdikt</span>
        <span className="text-xs font-mono text-muted-steel">PUBLIC VIEW</span>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">{c.case_title}</h1>
          <p className="text-sm text-text-secondary mt-1">{c.facility_name} · {c.shift_name}</p>
          <div className="mt-3"><PressureGauge level={c.current_pressure_level} label="Pressure Level" /></div>
        </div>

        <div className="bg-panel-steel/30 rounded-lg border border-border-line p-4 space-y-2 text-sm">
          <p><span className="text-muted-steel">Objective:</span> <span className="text-text-secondary">{c.business_objective}</span></p>
          <p><span className="text-muted-steel">Workers:</span> <span className="text-text-secondary">{c.available_workers} — {c.worker_skill_summary}</span></p>
          <p><span className="text-muted-steel">Status:</span> <span className="font-mono text-electric-blue">{c.case_status}</span></p>
        </div>

        <TaskSeverityStack tasks={data.tasks} />
        <EvidenceSignalBay evidence={data.evidence} />
        <VerdictChamber verdict={data.verdict} />
      </div>
    </div>
  );
}
