'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const studioNet = defineChain({
  id: 61999,
  name: 'GenLayer StudioNet',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://studio.genlayer.com/api'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer-studio.genlayer.com' },
  },
});

export const wagmiConfig = getDefaultConfig({
  appName: 'OpsVerdikt Protocol',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 'demo-project-id',
  chains: [studioNet],
  ssr: true,
});
