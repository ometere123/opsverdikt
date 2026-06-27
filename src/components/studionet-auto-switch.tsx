'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { studioNet } from '@/lib/wallet-config';

type EthereumProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

function getWalletErrorCode(error: unknown): number | string | undefined {
  if (!error || typeof error !== 'object') return undefined;

  const maybeError = error as {
    code?: number | string;
    cause?: { code?: number | string };
    data?: { originalError?: { code?: number | string } };
  };

  return maybeError.code ?? maybeError.cause?.code ?? maybeError.data?.originalError?.code;
}

async function addStudioNet(provider: EthereumProvider) {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: `0x${studioNet.id.toString(16)}`,
      chainName: studioNet.name,
      nativeCurrency: studioNet.nativeCurrency,
      rpcUrls: studioNet.rpcUrls.default.http,
      blockExplorerUrls: [studioNet.blockExplorers.default.url],
    }],
  });
}

async function switchInjectedWallet(provider: EthereumProvider) {
  const chainId = `0x${studioNet.id.toString(16)}`;

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    if (getWalletErrorCode(error) !== 4902) throw error;

    await addStudioNet(provider);
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  }
}

export function StudioNetAutoSwitch() {
  const currentChainId = useChainId();
  const { address, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const lastAttemptKey = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address || currentChainId === studioNet.id) return;

    const attemptKey = `${address}:${currentChainId ?? 'unknown'}`;
    if (lastAttemptKey.current === attemptKey) return;
    lastAttemptKey.current = attemptKey;

    let cancelled = false;

    async function switchNetwork() {
      try {
        await switchChainAsync({ chainId: studioNet.id });
      } catch {
        if (cancelled || !window.ethereum) return;
        try {
          await switchInjectedWallet(window.ethereum);
        } catch (error) {
          console.warn('Could not auto-switch wallet to StudioNet', error);
        }
      }
    }

    void switchNetwork();

    return () => {
      cancelled = true;
    };
  }, [address, currentChainId, isConnected, switchChainAsync]);

  return null;
}
