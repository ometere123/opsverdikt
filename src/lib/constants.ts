export const CONTRACT_ADDRESS = '0x598f4E3C1535d6cE256055B1A337AcFD765D1Df7' as const;

export const STUDIONET_CONFIG = {
  chainId: 61999,
  rpcUrl: 'https://studio.genlayer.com/api',
  name: 'StudioNet',
} as const;

export const EXPLORER_BASE = 'https://explorer-studio.genlayer.com';

export function txExplorerUrl(txHash: string): string {
  return `${EXPLORER_BASE}/tx/${txHash}`;
}

export function addressExplorerUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}

export const WORKER_BASE_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? 'https://ops-signal-adapter.delealufejoel.workers.dev';

export const CASE_STATUSES = [
  'DRAFT', 'SUBMITTED', 'SNAPSHOT_REGISTERED', 'TASKS_REGISTERED',
  'PLANS_REGISTERED', 'EVIDENCE_REGISTERED', 'REVIEW_READY',
  'UNDER_CONSENSUS_REVIEW', 'VERDICT_ISSUED', 'SUPERVISOR_ACTION_REQUIRED', 'ARCHIVED',
] as const;

export const REVIEW_STATUSES = ['NOT_STARTED', 'CONSENSUS_PENDING', 'VERDICT_READY', 'FAILED'] as const;

export const VERDICT_LABELS = [
  'BOTTLENECK_AWARE_SPLIT', 'SLA_PROTECTION_PRIORITY', 'REPLENISHMENT_FIRST',
  'COLD_CHAIN_OVERRIDE', 'PAUSE_INBOUND_PROTECT_OUTBOUND', 'EXCEPTION_CLEARANCE_REQUIRED',
  'INSUFFICIENT_EVIDENCE', 'HIGH_RISK_ESCALATION',
] as const;

export const FACILITY_ZONES = [
  'Outbound', 'Inbound', 'Replenishment', 'Staging', 'Exceptions', 'Cold-chain', 'Dock',
] as const;

export const PRESSURE_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const;

export type CaseStatus = typeof CASE_STATUSES[number];
export type ReviewStatus = typeof REVIEW_STATUSES[number];
export type VerdictLabel = typeof VERDICT_LABELS[number];
export type PressureLevel = typeof PRESSURE_LEVELS[number];
