'use client';

import React, { useState } from 'react';
import { Button } from '@inkonchain/ink-kit';
import { useWallets } from '@privy-io/react-auth';
import { Address, createWalletClient, custom, parseEther } from 'viem';
import { optimismSepolia } from 'viem/chains';

export const SendTransaction = () => {
  const { wallets } = useWallets();
  const wallet = wallets.find((wallet) => wallet.connectorType === 'embedded');

  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState('Idle');

  const sendTransaction = async () => {
    const provider = await wallet?.getEthereumProvider();

    if (!provider) {
      console.error('Wallet or provider not found');
      return;
    }

    const walletClient = createWalletClient({
      transport: custom(provider),
    });

    try {
      setStatus('Sending transaction...');
      const [account] = await walletClient.getAddresses();
      // Define the transaction
      const tx = {
        account,
        to: '0x36ed517b5aFB8F411C05a353bb92Be7E3Bb6D21D' as Address,
        value: parseEther('0.001'),
        chain: optimismSepolia,
      };

      // Send the transaction
      const hash = await walletClient.sendTransaction(tx);

      setTxHash(hash);
      setStatus('Transaction sent successfully!');
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus('Transaction failed');
    }
  };

  return (
    <div className='ink:text-text-on-primary mt-6'>
      <h1>Send Transaction</h1>
      <Button onClick={sendTransaction}>Send 0.001 ETH</Button>
      <p>Status: {status}</p>
      {txHash && (
        <p>
          Transaction Hash:{' '}
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
};
