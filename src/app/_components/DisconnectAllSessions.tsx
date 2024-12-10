'use client';

import { useWalletKitContext } from '@/context/WalletKitContext';
import { Button } from '@inkonchain/ink-kit';
import { getSdkError } from '@walletconnect/utils';

export const DisconnectAllSessions = () => {
  const { walletKit, sessions } = useWalletKitContext();

  const handleDisconnectAllSessions = async () => {
    if (!walletKit) return;

    for (const session of sessions) {
      await walletKit.disconnectSession({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });

      console.log(`Disconnceted from topic: ${session.topic}`);
    }
  };

  return (
    <div className="mt-8">
      <span className="ink:text-text-on-secondary">
        <Button
          disabled={!walletKit || sessions.length === 0}
          onClick={handleDisconnectAllSessions}
        >
          Disconnect from all sessions
        </Button>
      </span>
    </div>
  );
};
