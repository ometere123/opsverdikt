'use client';

import { CONTRACT_ADDRESS, addressExplorerUrl } from '@/lib/constants';
import { ExternalLink, FileCode } from 'lucide-react';

export function ContractStatusPanel() {
  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
      <div className="flex items-center gap-2 mb-2">
        <FileCode className="w-4 h-4 text-system-green" />
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Contract</h3>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-steel">Network</span>
          <span className="font-mono text-text-secondary">StudioNet</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-steel">Address</span>
          <a
            href={addressExplorerUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-electric-blue hover:underline flex items-center gap-1"
          >
            {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-steel">Status</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-system-green" />
            <span className="text-system-green font-mono">ACTIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
}
