'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getOperationsCase, requestOpsConsensusReview } from '@/lib/contract-service';
import { saveTxHash } from '@/lib/tx-store';
import type { FullCaseData } from '@/lib/types';
import {
  PressureRail, FacilityPressureMap, DecisionStack, EvidenceSignalBay,
  VerdictChamber, ShiftTimeline, WalletIdentityPlate, TaskSeverityStack,
  BottleneckRadar, WorkerFeedPanel,
} from '@/components/pressure-deck';
import type { ZoneData } from '@/components/pressure-deck';
import { Shield, ArrowLeft, Plus, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

function buildZones(data: FullCaseData): ZoneData[] {
  const zoneNames = ['Outbound', 'Inbound', 'Replenishment', 'Staging', 'Exceptions', 'Cold-chain', 'Dock'];
  return zoneNames.map((name) => {
    const zoneTasks = data.tasks.filter((t) => t.department === name);
    const blockers = zoneTasks.filter((t) => t.delay_risk && t.delay_risk !== 'None').length;
    const hasHighImpact = zoneTasks.some((t) => t.SLA_impact === 'CRITICAL' || t.SLA_impact === 'HIGH');
    const evidenceCount = data.evidence.filter((e) =>
      e.related_task_ids?.split(',').some((id) => zoneTasks.some((t) => t.task_id === id.trim()))
    ).length;

    return {
      name,
      pressure: blockers > 0 && hasHighImpact ? 'CRITICAL' : hasHighImpact ? 'HIGH' : zoneTasks.length > 0 ? 'MODERATE' : 'LOW',
      taskCount: zoneTasks.length,
      blockers,
      workerAllocation: 0,
      riskState: hasHighImpact ? 'HIGH' : 'STABLE',
      slaImpact: hasHighImpact ? 'HIGH' : 'NONE',
      evidenceCount,
    };
  });
}

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<FullCaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [polling, setPolling] = useState(false);

  const loadCase = useCallback(async () => {
    try {
      const result = await getOperationsCase(caseId);
      setData(result);
      setError(null);

      if (result.case.review_status === 'CONSENSUS_PENDING') {
        setPolling(true);
      } else {
        setPolling(false);
      }
    } catch (e) {
      setError('Could not load case from contract');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => { loadCase(); }, [loadCase]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(loadCase, 8000);
    return () => clearInterval(interval);
  }, [polling, loadCase]);

  async function handleRequestReview() {
    if (!isConnected || !address) return;
    setReviewing(true);
    try {
      const hash = await requestOpsConsensusReview(address, caseId);
      if (hash) saveTxHash(caseId, 'review', hash as string);
      setPolling(true);
      await loadCase();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Review request failed');
    } finally {
      setReviewing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-floor-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-signal-amber animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-floor-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-critical-red text-sm mb-3">{error ?? 'Case not found'}</p>
          <Link href="/dashboard" className="text-xs text-electric-blue hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const c = data.case;
  const zones = buildZones(data);
  const canRequestReview = c.review_status === 'NOT_STARTED' && data.evidence.length > 0 && data.plans.length > 0;
  const showVerdikt = c.review_status === 'VERDICT_READY' && data.verdict;

  const subPages = [
    { label: 'Snapshot', href: `/ops/${caseId}/snapshot`, count: data.snapshots.length },
    { label: 'Tasks', href: `/ops/${caseId}/tasks`, count: data.tasks.length },
    { label: 'Plans', href: `/ops/${caseId}/plans`, count: data.plans.length },
    { label: 'Evidence', href: `/ops/${caseId}/evidence`, count: data.evidence.length },
  ];

  return (
    <div className="h-screen flex flex-col bg-floor-black overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border-line bg-dark-graphite flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-steel hover:text-text-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Shield className="w-4 h-4 text-signal-amber" />
          <span className="font-display text-sm font-bold text-text-primary truncate max-w-xs">{c.case_title}</span>
          <span className="font-mono text-[10px] text-muted-steel">{caseId}</span>
        </div>
        <div className="flex items-center gap-3">
          {subPages.map((p) => (
            <Link key={p.href} href={p.href}
              className="text-xs text-muted-steel hover:text-text-secondary flex items-center gap-1"
            >
              {p.label}
              {p.count > 0 && <span className="font-mono text-[10px] text-electric-blue">{p.count}</span>}
            </Link>
          ))}
          <button onClick={loadCase} className="text-muted-steel hover:text-text-secondary">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <WalletIdentityPlate />
        </div>
      </header>

      {/* Main 3-column layout: PressureRail | FacilityMap | DecisionStack */}
      <div className="flex flex-1 overflow-hidden">
        <PressureRail
          pressureLevel={c.current_pressure_level}
          slaRisk={data.tasks.some((t) => t.SLA_impact === 'HIGH' || t.SLA_impact === 'CRITICAL') ? 'HIGH' : 'LOW'}
          bottleneckRisk={data.tasks.some((t) => t.delay_risk && t.delay_risk !== 'None') ? 'HIGH' : 'LOW'}
          workerCount={c.available_workers}
          carrierCutoffMinutes={90}
          consensusStatus={c.review_status}
          contractStatus="ACTIVE"
          workerFeedStatus="LIVE"
        />

        {/* Center panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <FacilityPressureMap zones={zones} />

            {/* Sub-panels */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <TaskSeverityStack tasks={data.tasks} />
              <BottleneckRadar bottlenecks={
                data.tasks
                  .filter((t) => t.delay_risk && t.delay_risk !== 'None')
                  .map((t) => ({
                    zone: t.department,
                    description: t.delay_risk,
                    severity: (t.SLA_impact === 'CRITICAL' ? 'CRITICAL' : t.SLA_impact === 'HIGH' ? 'HIGH' : 'MODERATE') as 'CRITICAL' | 'HIGH' | 'MODERATE',
                  }))
              } />
              <div className="lg:col-span-2">
                <WorkerFeedPanel />
              </div>
              <div className="lg:col-span-2">
                <ShiftTimeline caseId={caseId} caseStatus={c.case_status} reviewStatus={c.review_status} />
              </div>
            </div>

            {/* Consensus action */}
            {canRequestReview && !showVerdikt && (
              <div className="px-4 pb-4">
                <button
                  onClick={handleRequestReview}
                  disabled={reviewing}
                  className="w-full py-3 rounded-lg bg-signal-amber text-floor-black font-display font-bold text-sm hover:bg-signal-amber/90 disabled:opacity-50 flex items-center justify-center gap-2 glow-amber"
                >
                  {reviewing ? <><Loader2 className="w-4 h-4 animate-spin" /> Requesting Consensus...</> : 'Request Ops Consensus Review'}
                </button>
              </div>
            )}

            {c.review_status === 'CONSENSUS_PENDING' && (
              <div className="px-4 pb-4">
                <div className="rounded-lg border border-signal-amber/30 bg-signal-amber/5 p-4 text-center glow-amber">
                  <Loader2 className="w-5 h-5 text-signal-amber animate-spin mx-auto mb-2" />
                  <p className="text-sm font-display font-bold text-signal-amber">Consensus Review in Progress</p>
                  <p className="text-xs text-muted-steel mt-1">Polling contract every 8 seconds...</p>
                </div>
              </div>
            )}

            {c.review_status === 'FAILED' && (
              <div className="px-4 pb-4">
                <div className="rounded-lg border border-critical-red/30 bg-critical-red/5 p-4 text-center">
                  <p className="text-sm text-critical-red font-bold">Consensus Review Failed</p>
                  <button
                    onClick={handleRequestReview}
                    className="mt-2 text-xs text-electric-blue hover:underline"
                  >
                    Retry Review
                  </button>
                </div>
              </div>
            )}

            {/* Evidence Bay */}
            <EvidenceSignalBay evidence={data.evidence} />

            {/* Verdikt Chamber */}
            <VerdictChamber verdict={data.verdict} />
          </div>
        </div>

        <DecisionStack plans={data.plans} recommendedPlanId={data.verdict?.recommended_plan_id} />
      </div>
    </div>
  );
}
