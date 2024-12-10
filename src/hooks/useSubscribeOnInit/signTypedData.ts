import { IWalletKit } from '@reown/walletkit';
import { ConnectedWallet } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { TypedData } from '@/schemas/EIP712DomainSchema';

interface SignTypedDataOptions {
  wallet: ConnectedWallet;
  walletKit: IWalletKit;
  context: {
    requestId: number;
    topic: string;
    data: TypedData;
  };
}

export async function signTypedData({
  wallet,
  context,
  walletKit,
}: SignTypedDataOptions) {
  const { topic, data, requestId } = context;

  try {
    const walletClient = createWalletClient({
      transport: custom(await wallet.getEthereumProvider()),
    });

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
