'use client';

import { AccountInfo } from './_components/AccountInfo';
import { DisconnectAllSessions } from './_components/DisconnectAllSessions';
import { PairWallet } from './_components/PairWallet';

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <AccountInfo />

      <PairWallet />

      <DisconnectAllSessions />
    </div>
  );
}
