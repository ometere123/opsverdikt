'use client';

import Link from 'next/link';
import { WalletIdentityPlate, ContractStatusPanel } from '@/components/pressure-deck';
import { CONTRACT_ADDRESS, STUDIONET_CONFIG, addressExplorerUrl, WORKER_BASE_URL } from '@/lib/constants';
import { Shield, ArrowLeft, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border-line bg-dark-graphite">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
          <Shield className="w-4 h-4 text-signal-amber" />
          <span className="font-display text-sm font-bold text-text-primary">Settings</span>
        </div>
        <WalletIdentityPlate />
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <ContractStatusPanel />

        <div className="bg-panel-steel/30 rounded-lg border border-border-line p-4 space-y-3">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Network Configuration</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-steel">Network</span>
              <span className="font-mono text-text-secondary">{STUDIONET_CONFIG.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-steel">Chain ID</span>
              <span className="font-mono text-text-secondary">{STUDIONET_CONFIG.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-steel">RPC</span>
              <span className="font-mono text-text-secondary">{STUDIONET_CONFIG.rpcUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-steel">Contract</span>
              <a href={addressExplorerUrl(CONTRACT_ADDRESS)} target="_blank" rel="noopener noreferrer"
                className="font-mono text-electric-blue hover:underline flex items-center gap-1">
                {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-steel">Worker</span>
              <span className="font-mono text-text-secondary">{WORKER_BASE_URL}</span>
            </div>
          </div>
        </div>

        <div className="bg-panel-steel/30 rounded-lg border border-border-line p-4">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Architecture</h3>
          <div className="space-y-1 text-xs text-text-secondary">
            <p><span className="text-signal-amber">GenLayer Contract</span> = canonical judgment and state layer</p>
            <p><span className="text-electric-blue">Cloudflare Worker</span> = public signal adapter and demo-feed only</p>
            <p><span className="text-text-primary">Frontend</span> = command interface only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
