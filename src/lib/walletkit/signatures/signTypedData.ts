import { IWalletKit } from '@reown/walletkit';
import { WalletClient } from 'viem';
import { TypedData } from '@/schemas/EIP712DomainSchema';

interface SignTypedDataOptions {
  walletClient: WalletClient;
  walletKit: IWalletKit;
  context: {
    requestId: number;
    topic: string;
    data: TypedData;
  };
}

export async function signTypedData({
  walletClient,
  walletKit,
  context,
}: SignTypedDataOptions) {
  const { topic, data, requestId } = context;

  try {
    const [account] = await walletClient.getAddresses();
    const signature = await walletClient.signTypedData({
      account,
      domain: data.domain,
      types: data.types,
      primaryType: data.primaryType,
      message: data.message,
    });

    const response = {
      id: requestId,
      jsonrpc: '2.0',
      result: signature,
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
