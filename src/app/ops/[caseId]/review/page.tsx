'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getFullCase, requestVerdikt } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import type { FullCaseData } from '@/lib/types';
import { VerdictChamber } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';

export default function ReviewPage() {
  const { caseId } = useParams() as { caseId: string };
  const numId = Number(caseId);
  const [data, setData] = useState<FullCaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCase = useCallback(async () => {
    try { setData(await getFullCase(numId)); }
    catch { setError('Failed to load'); }
    finally { setLoading(false); }
  }, [numId]);

  useEffect(() => { loadCase(); }, [loadCase]);
  useEffect(() => {
    if (!data || (data.case.status !== 'CONSENSUS_PENDING' && data.case.status !== 'UNDER_REVIEW')) return;
    const interval = setInterval(loadCase, 8000);
    return () => clearInterval(interval);
  }, [data?.case.status, loadCase]);

  async function handleReview() {
    setReviewing(true);
    try {
      const hash = await requestVerdikt(numId);
      if (hash) saveTxHash(caseId, 'review', hash as string);
      await loadCase();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setReviewing(false); }
  }

  const hasVerdikt = data?.verdict !== null && data?.verdict !== undefined;
  const isReviewing = data?.case.status === 'CONSENSUS_PENDING' || data?.case.status === 'UNDER_REVIEW';

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border-line bg-dark-graphite">
        <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
        <Shield className="w-4 h-4 text-signal-amber" />
        <span className="font-display text-sm font-bold text-text-primary">Consensus Review</span>
        <span className="font-mono text-[10px] text-muted-steel">#{caseId}</span>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        {loading && <div className="text-center py-12"><Loader2 className="w-6 h-6 text-signal-amber animate-spin mx-auto" /></div>}
        {data && !hasVerdikt && !isReviewing && (
          <div className="text-center py-12 space-y-4">
            <p className="text-text-secondary">Ready to submit for GenLayer consensus evaluation</p>
            <p className="text-xs text-muted-steel">{data.plans.length} plans · {data.evidence.length} evidence · {data.tasks.length} tasks</p>
            <button onClick={handleReview} disabled={reviewing}
              className="px-8 py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 glow-amber">
              {reviewing ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Requesting...</> : 'Request Ops Consensus Review'}
            </button>
          </div>
        )}
        {data && isReviewing && !hasVerdikt && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-signal-amber animate-spin mx-auto" />
            <p className="font-display text-lg font-bold text-signal-amber">Consensus Review in Progress</p>
            <p className="text-xs text-muted-steel">Polling contract every 8 seconds...</p>
          </div>
        )}
        {data && hasVerdikt && <VerdictChamber verdict={data.verdict} />}
        {error && <p className="text-critical-red text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
