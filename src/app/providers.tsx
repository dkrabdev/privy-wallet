'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PropsWithChildren } from 'react';
import { DEFAULT_CHAIN } from '@/utils/constants';
import { optimismSepolia } from 'viem/chains';
import { WalletKitContextProvider } from '@/context/WalletKitContext';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <PrivyProvider
      appId={process.env['NEXT_PUBLIC_PRIVY_APP_ID'] as string}
      config={{
        defaultChain: DEFAULT_CHAIN,
        supportedChains: [DEFAULT_CHAIN, optimismSepolia],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      <WalletKitContextProvider>{children}</WalletKitContextProvider>
    </PrivyProvider>
  );
};
