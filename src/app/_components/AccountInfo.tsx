'use client';

import { useCurrentWallet } from '@/hooks/useCurrentWallet';
import { Typography } from '@inkonchain/ink-kit';

export const AccountInfo = () => {
  const wallet = useCurrentWallet();

  return (
    <div className="mt-8">
      <span className="ink:text-text-on-secondary">
        <Typography variant="body-2-bold">Wallet Address:</Typography>

        <Typography variant="body-2-regular">
          {wallet?.address || 'No Wallet Connected'}
        </Typography>
      </span>
    </div>
  );
};
