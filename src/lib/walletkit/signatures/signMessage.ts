import { IWalletKit } from '@reown/walletkit';
import { hexToString, WalletClient } from 'viem';

interface SignMessageOptions {
  walletClient: WalletClient;
  walletKit: IWalletKit;
  context: {
    requestId: number;
    topic: string;
    message: `0x${string}`;
  };
}

export async function signMessage({
  walletClient,
  context,
  walletKit,
}: SignMessageOptions) {
  const { topic, message, requestId } = context;

  try {
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
