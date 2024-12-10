import { createWalletClient, custom } from 'viem';
import { ConnectedWallet } from '@privy-io/react-auth';

export async function getWalletClient(wallet: ConnectedWallet) {
  const walletClient = createWalletClient({
    transport: custom(await wallet.getEthereumProvider()),
  });

  return walletClient;
}
