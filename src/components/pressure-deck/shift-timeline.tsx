'use client';

import { getAllTxHashes } from '@/lib/tx-store';
import { TransactionCommandStrip } from './transaction-command-strip';

const STEP_LABELS: Record<string, string> = {
  case: 'Operations Case Created',
  snapshot: 'Shift Snapshot Registered',
  tasks: 'Task Queue Added',
  plans: 'Labor Plans Registered',
  evidence: 'Evidence Registered',
  review: 'Consensus Review Requested',
};

export function ShiftTimeline({
  caseId,
  caseStatus,
  reviewStatus,
}: {
  caseId: string;
  caseStatus: string;
  reviewStatus: string;
}) {
  const txHashes = getAllTxHashes(caseId);
  const allSteps = ['case', 'snapshot', 'tasks', 'plans', 'evidence', 'review'] as const;

  const statusOrder = [
    'SUBMITTED', 'SNAPSHOT_REGISTERED', 'TASKS_REGISTERED',
    'PLANS_REGISTERED', 'EVIDENCE_REGISTERED', 'UNDER_CONSENSUS_REVIEW', 'VERDICT_ISSUED',
  ];
  const currentIdx = statusOrder.indexOf(caseStatus);

  const steps = allSteps.map((step, i) => ({
    label: STEP_LABELS[step],
    txHash: txHashes[step],
    status: (i <= currentIdx ? 'completed' :
      i === currentIdx + 1 ? 'active' : 'pending') as 'completed' | 'active' | 'pending',
  }));

  if (reviewStatus === 'VERDICT_READY') {
    steps.push({
      label: 'Ops Verdikt Issued',
      txHash: txHashes.review,
      status: 'completed',
    });
  }

  return <TransactionCommandStrip steps={steps} />;
}
