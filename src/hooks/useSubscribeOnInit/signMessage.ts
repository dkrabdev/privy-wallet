import { IWalletKit } from '@reown/walletkit';
import { ConnectedWallet } from '@privy-io/react-auth';
import { createWalletClient, custom, hexToString } from 'viem';

interface SignMessageOptions {
  wallet: ConnectedWallet;
  walletKit: IWalletKit;
  context: {
    requestId: number;
    topic: string;
    message: `0x${string}`;
  };
}

export async function signMessage({
  wallet,
  context,
  walletKit,
}: SignMessageOptions) {
  const { topic, message, requestId } = context;

  try {
    const walletClient = createWalletClient({
      transport: custom(await wallet.getEthereumProvider()),
    });

    const [account] = await walletClient.getAddresses();
    const signature = await walletClient.signMessage({
      account,
      message: hexToString(message),
    });

    const response = {
      id: requestId,
      jsonrpc: '2.0',
      result: signature,
    };

    await walletKit.respondSessionRequest({ topic, response });
  } catch (error) {
    console.log('[signMessage] error:', error);
    await walletKit.respondSessionRequest({
      topic,
      response: {
        id: requestId,
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'An error occurred during signing',
        },
      },
    });
  }
}
