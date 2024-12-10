'use client';

import { Button } from '@inkonchain/ink-kit';
import { usePrivy } from '@privy-io/react-auth';

export const LoginButton = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableActions = !ready;

  if (ready && authenticated) {
    return (
      <Button disabled={disableActions} onClick={logout}>
        Log out
      </Button>
    );
  }

  return (
    <Button disabled={disableActions} onClick={login}>
      Log in
    </Button>
  );
};
