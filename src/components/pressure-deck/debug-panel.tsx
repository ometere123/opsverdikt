'use client';

import { useAccount, useChainId } from 'wagmi';
import { CONTRACT_ADDRESS } from '@/lib/constants';

export function DebugPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-2 left-2 z-50 bg-deep-console/95 border border-border-line rounded-md px-3 py-2 text-[10px] font-mono text-muted-steel space-y-0.5 max-w-xs">
      <div className="text-electric-blue font-bold mb-1">DEBUG</div>
      <div>wallet: {isConnected ? <span className="text-system-green">{address}</span> : <span className="text-critical-red">not connected</span>}</div>
      <div>write signer: {isConnected ? <span className="text-system-green">{address}</span> : <span className="text-critical-red">none</span>}</div>
      <div>chain: <span className="text-signal-amber">{chainId}</span></div>
      <div>contract: <span className="text-text-secondary">{CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)}</span></div>
    </div>
  );
}
