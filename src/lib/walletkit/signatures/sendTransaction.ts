import { IWalletKit } from '@reown/walletkit';
import { WalletClient } from 'viem';
import { DEFAULT_CHAIN } from '@/utils/constants';

interface SednTransactionOptions {
  walletClient: WalletClient;
  walletKit: IWalletKit;
  context: {
    requestId: number;
    topic: string;
    data: {
      to: `0x${string}`;
      gas: string;
      value: `0x${string}`;
    };
  };
}

export async function sendTransaction({
  walletKit,
  walletClient,
  context,
}: SednTransactionOptions) {
  const { requestId, topic, data } = context;

  try {
    const [account] = await walletClient.getAddresses();
    const hash = await walletClient.sendTransaction({
      account,
      chain: DEFAULT_CHAIN,
      to: data.to,
      value: BigInt(data.value),
    });

    const response = {
      id: requestId,
      jsonrpc: '2.0',
      result: hash,
    };

    await walletKit.respondSessionRequest({ topic, response });
  } catch (error) {
    console.log('[signTypedData] error:', error);

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
