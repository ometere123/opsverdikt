'use client';

import { txExplorerUrl } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';

export function ExplorerAuditLink({ txHash, label }: { txHash: string; label?: string }) {
  return (
    <a
      href={txExplorerUrl(txHash)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-mono text-electric-blue hover:text-electric-blue/80 transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      {label ?? `${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
    </a>
  );
}
