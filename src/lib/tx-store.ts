const PREFIX = 'opsverdict:tx:';

type TxStep = 'case' | 'snapshot' | 'tasks' | 'plans' | 'evidence' | 'review';

function key(caseId: string, step: TxStep): string {
  return `${PREFIX}${caseId}:${step}`;
}

export function saveTxHash(caseId: string, step: TxStep, hash: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key(caseId, step), hash);
}

export function getTxHash(caseId: string, step: TxStep): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key(caseId, step));
}

export function getAllTxHashes(caseId: string): Partial<Record<TxStep, string>> {
  const steps: TxStep[] = ['case', 'snapshot', 'tasks', 'plans', 'evidence', 'review'];
  const result: Partial<Record<TxStep, string>> = {};
  for (const step of steps) {
    const hash = getTxHash(caseId, step);
    if (hash) result[step] = hash;
  }
  return result;
}
