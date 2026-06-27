'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { getOperationsCase, requestOpsConsensusReview } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import type { FullCaseData } from '@/lib/types';
import { VerdictChamber } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';

export default function ReviewPage() {
  const { caseId } = useParams() as { caseId: string };
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<FullCaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCase = useCallback(async () => {
    try {
      const result = await getOperationsCase(caseId);
      setData(result);
    } catch { setError('Failed to load'); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { loadCase(); }, [loadCase]);

  useEffect(() => {
    if (data?.case.review_status !== 'CONSENSUS_PENDING') return;
    const interval = setInterval(loadCase, 8000);
    return () => clearInterval(interval);
  }, [data?.case.review_status, loadCase]);

  async function handleReview() {
    if (!isConnected || !address) return;
    setReviewing(true);
    try {
      const hash = await requestOpsConsensusReview(address, caseId);
      if (hash) saveTxHash(caseId, 'review', hash as string);
      await loadCase();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setReviewing(false); }
  }

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border-line bg-dark-graphite">
        <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
        <Shield className="w-4 h-4 text-signal-amber" />
        <span className="font-display text-sm font-bold text-text-primary">Consensus Review</span>
        <span className="font-mono text-[10px] text-muted-steel">{caseId}</span>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {loading && <div className="text-center py-12"><Loader2 className="w-6 h-6 text-signal-amber animate-spin mx-auto" /></div>}

        {data && data.case.review_status === 'NOT_STARTED' && (
          <div className="text-center py-12 space-y-4">
            <p className="text-text-secondary">Ready to submit for GenLayer consensus evaluation</p>
            <p className="text-xs text-muted-steel">{data.plans.length} plans · {data.evidence.length} evidence · {data.tasks.length} tasks</p>
            <button onClick={handleReview} disabled={reviewing || !isConnected}
              className="px-8 py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 glow-amber">
              {reviewing ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Requesting...</> : 'Request Ops Consensus Review'}
            </button>
          </div>
        )}

        {data && data.case.review_status === 'CONSENSUS_PENDING' && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-signal-amber animate-spin mx-auto" />
            <p className="font-display text-lg font-bold text-signal-amber">Consensus Review in Progress</p>
            <p className="text-xs text-muted-steel">Polling contract every 8 seconds...</p>
          </div>
        )}

        {data && data.case.review_status === 'VERDICT_READY' && (
          <VerdictChamber verdict={data.verdict} />
        )}

        {data && data.case.review_status === 'FAILED' && (
          <div className="text-center py-12 space-y-3">
            <p className="text-critical-red font-bold">Review Failed</p>
            <button onClick={handleReview} className="text-xs text-electric-blue hover:underline">Retry</button>
          </div>
        )}

        {error && <p className="text-critical-red text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
