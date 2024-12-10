'use client';

import React, {
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { Core } from '@walletconnect/core';
import { WalletKit, IWalletKit } from '@reown/walletkit';
import { SessionTypes } from '@walletconnect/types';
import { useCurrentWallet } from '@/hooks/useCurrentWallet';
import { useSubscribeOnInit } from '@/hooks/useSubscribeOnInit/useSubscribeOnInit';

interface WalletKitValue {
  walletKit: IWalletKit | null;
  sessions: SessionTypes.Struct[];
}

export const WalletKitContext = React.createContext<WalletKitValue | undefined>(
  undefined
);

export const WalletKitContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const wallet = useCurrentWallet();
  const [walletKit, setWalletKit] = useState<IWalletKit | null>(null);
  const [sessions, setSessions] = useState<SessionTypes.Struct[]>([]);

  useEffect(() => {
    const initWalletKit = async () => {
      const core = new Core({
        projectId: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'],
      });

      const metadata = {
        name: 'Privy Wallet',
        description: 'AppKit Example',
        url: process.env['NEXT_PUBLIC_APP_URL'] as string,
        icons: ['https://assets.reown.com/reown-profile-pic.png'],
      };

      const walletKitInstance = await WalletKit.init({
        core,
        metadata,
      });

      setWalletKit(walletKitInstance);
    };

    initWalletKit();
  }, []);

  useSubscribeOnInit(walletKit, wallet);

  useEffect(() => {
    if (!walletKit) return;

    walletKit.on('session_delete', (data) => {
      console.log('session_delete event received', data);
      // setSessions(Object.values(walletKit.getActiveSessions()));
    });
  }, [walletKit]);

  useEffect(() => {
    if (!walletKit) return;

    setSessions(Object.values(walletKit.getActiveSessions()));
  }, [walletKit]);

  return (
    <WalletKitContext.Provider
      value={{
        walletKit,
        sessions,
      }}
    >
      {children}
    </WalletKitContext.Provider>
  );
};

export const useWalletKitContext = (): WalletKitValue => {
  const context = useContext(WalletKitContext);

  if (!context) {
    throw new Error('WalletKitContext not initialized');
  }

  return context;
};
