'use client';

import { useWallets } from '@privy-io/react-auth';

export const useCurrentWallet = () => {
  const { ready, wallets } = useWallets();

  const embeddedWallet = wallets.find(
    (wallet) => wallet.connectorType === 'embedded'
  );

  if (!ready || !embeddedWallet) return null;

  return embeddedWallet;
};
