'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOperationsCase } from '@/lib/contract-service';
import { getTxHash } from '@/lib/tx-store';
import type { FullCaseData } from '@/lib/types';
import { VerdictChamber } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';

export default function VerdictPage() {
  const { caseId } = useParams() as { caseId: string };
  const [data, setData] = useState<FullCaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOperationsCase(caseId).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [caseId]);

  const txHash = getTxHash(caseId, 'review') ?? undefined;

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border-line bg-dark-graphite">
        <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
        <Shield className="w-4 h-4 text-signal-amber" />
        <span className="font-display text-sm font-bold text-text-primary">Ops Verdikt</span>
        <span className="font-mono text-[10px] text-muted-steel">{caseId}</span>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        {loading && <div className="text-center py-12"><Loader2 className="w-6 h-6 text-signal-amber animate-spin mx-auto" /></div>}
        {data && <VerdictChamber verdict={data.verdict} txHash={txHash} />}
      </div>
    </div>
  );
}
