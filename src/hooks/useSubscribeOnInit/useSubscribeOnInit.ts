import { useCallback, useEffect, useState } from 'react';
import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import { ConnectedWallet } from '@privy-io/react-auth';
import { IWalletKit, WalletKitTypes } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { SignClientTypes } from '@walletconnect/types';
import { TypedDataSchema, TypedData } from '@/schemas/EIP712DomainSchema';

import { signMessage } from './signMessage';
import { signTypedData } from './signTypedData';

export const useSubscribeOnInit = (
  walletKit: IWalletKit | null,
  wallet: ConnectedWallet | null
) => {
  const [initiated, setInitiated] = useState(false);

  const onSessionProposal = useCallback(
    async (proposal: WalletKitTypes.SessionProposal) => {
      if (!walletKit) return;

      const { id } = proposal;

      try {
        const chains = Object.keys(EIP155_CHAINS);
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: proposal.params,
          supportedNamespaces: {
            eip155: {
              chains,
              methods: Object.values(EIP155_SIGNING_METHODS),
              events: ['accountsChanged', 'chainChanged'],
              accounts: chains.map(
                (chainId) => `${chainId}:${wallet?.address}`
              ),
            },
          },
        });

        await walletKit.approveSession({
          id,
          namespaces: approvedNamespaces,
        });
      } catch (error) {
        console.error(error);

        await walletKit.rejectSession({
          id,
          reason: getSdkError('USER_REJECTED'),
        });
      }
    },
    [wallet, walletKit]
  );

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      if (!wallet || !walletKit) return;

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
            wallet,
            context: { requestId: id, topic, message },
            walletKit,
          });

          break;
        }
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          const { topic, params, id } = requestEvent;
          const message = params?.request.params[1];

          if (!message) {
            throw new Error('No message provided');
          }

          const parsedData = parseSignTypedMessage(message);

          if (!parsedData) {
            throw new Error('Could not parse data');
          }

          await signTypedData({
            wallet,
            walletKit,
            context: {
              requestId: id,
              topic,
              data: parsedData,
            },
          });

          break;
        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          console.log('Handle Send Transaction');
          break;
        default:
          break;
      }
    },
    [wallet, walletKit]
  );

  useEffect(() => {
    if (!walletKit || !wallet || initiated) return;

    walletKit.on('session_proposal', onSessionProposal);

    walletKit.on('session_request', onSessionRequest);

    setInitiated(true);
  }, [walletKit, wallet, initiated, onSessionProposal, onSessionRequest]);
};

function parseSignTypedMessage(message: string): TypedData | null {
  try {
    const data = JSON.parse(message);
    const parsedData = TypedDataSchema.parse(data) as TypedData;

    return parsedData;
  } catch (error) {
    console.log('[parseSignTypedMessage] Could not parse data:', error);
    return null;
  }
}
