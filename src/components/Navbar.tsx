'use client';

import { LoginButton } from '@/app/_components/LoginButton';
import { InkLogo } from './InkLogo';
import { Typography } from '@inkonchain/ink-kit';

import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className="border-b border-inkPurple ink:bg-background-dark">
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-24 items-center justify-between px-48">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/" className="flex shrink-0 items-center">
              <InkLogo />

              <Typography
                variant="h2"
                className="ml-3 ink:text-text-on-secondary"
              >
                Smart Account Wallet
              </Typography>
            </Link>
          </div>

          <div>
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};
