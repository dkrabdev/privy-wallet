'use client';

import React, { type FormEvent } from 'react';
import { Button, Input } from '@inkonchain/ink-kit';
import { useCurrentWallet } from '@/hooks/useCurrentWallet';
import { useWalletKitContext } from '@/context/WalletKitContext';

export const PairWallet = () => {
  const wallet = useCurrentWallet();
  const { walletKit } = useWalletKitContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!walletKit) return;

    const formData = new FormData(e.currentTarget);
    const uri = formData.get('uri') as string;

    console.log('URI Submitted:', uri);

    try {
      await walletKit.pair({ uri });
      console.log('Pairing successful');
    } catch (error) {
      console.error('Pairing failed:', error);
    }
  };

  if (!wallet) {
    return null;
  }

  return (
    <form
      className="mt-4 flex gap-3 items-center w-[720px]"
      onSubmit={handleSubmit}
    >
      <Input type="text" name="uri" placeholder="Paste WC URI" />

      <Button type="submit" size="sm">
        Pair
      </Button>
    </form>
  );
};
