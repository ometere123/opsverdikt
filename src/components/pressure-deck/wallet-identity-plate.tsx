'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletIdentityPlate() {
  return (
    <div className="flex items-center">
      <ConnectButton
        chainStatus="icon"
        showBalance={false}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
}
