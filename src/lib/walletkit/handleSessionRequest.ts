import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import { IWalletKit } from '@reown/walletkit';
import { SignClientTypes } from '@walletconnect/types';

import { signMessage } from './signatures/signMessage';
import { signTypedData } from './signatures/signTypedData';
import { TypedData, TypedDataSchema } from '@/schemas/EIP712DomainSchema';
import { sendTransaction } from './signatures/sendTransaction';
import { WalletClient } from 'viem';

export async function handleSessionRequest(
  walletKit: IWalletKit,
  walletClient: WalletClient,
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  switch (requestEvent.params.request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN: {
      const { topic, params, id } = requestEvent;

      const message =
        params?.request.method === 'personal_sign'
          ? (params?.request.params[0] as `0x${string}`)
          : null;

      if (!message) {
        throw new Error('No message provided');
      }

      await signMessage({
        walletClient,
        walletKit,
        context: { requestId: id, topic, message },
      });

      break;
    }
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4: {
      const { topic, params, id } = requestEvent;
      const message = params?.request.params[1];

      if (!message) {
        throw new Error('No message provided');
      }

      console.log(message);

      const parsedData = parseSignTypedMessage(message);

      if (!parsedData) {
        throw new Error('Could not parse data');
      }

      await signTypedData({
        walletClient,
        walletKit,
        context: {
          requestId: id,
          topic,
          data: parsedData,
        },
      });

      break;
    }
    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION: {
      const { topic, params, id } = requestEvent;
      const { to, gas, value } = params?.request.params[0];

      await sendTransaction({
        walletClient,
        walletKit,
        context: {
          requestId: id,
          topic,
          data: {
            to,
            gas,
            value,
          },
        },
      });

      break;
    }
    default:
      break;
  }
}

function parseSignTypedMessage(message: string): TypedData | null {
  try {
    const data = JSON.parse(message);
    console.log('DATA', data);
    const parsedData = TypedDataSchema.parse(data) as TypedData;

    return parsedData;
  } catch (error) {
    console.log('[parseSignTypedMessage] Could not parse data:', error);
    return null;
  }
}
