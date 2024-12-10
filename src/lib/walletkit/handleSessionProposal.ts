import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
import { IWalletKit, WalletKitTypes } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { WalletClient } from 'viem';

export async function handleSessionProposal(
  walletKit: IWalletKit,
  walletClient: WalletClient,
  proposal: WalletKitTypes.SessionProposal
) {
  const { id } = proposal;

  try {
    const [account] = await walletClient.getAddresses();

    const chains = Object.keys(EIP155_CHAINS);
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: proposal.params,
      supportedNamespaces: {
        eip155: {
          chains,
          methods: Object.values(EIP155_SIGNING_METHODS),
          events: ['accountsChanged', 'chainChanged'],
          accounts: chains.map((chainId) => `${chainId}:${account}`),
        },
      },
    });

    await walletKit.approveSession({
      id,
      namespaces: approvedNamespaces,
    });
  } catch (error) {
    console.error('[handleSessionProposal] error: ', error);

    await walletKit.rejectSession({
      id,
      reason: getSdkError('USER_REJECTED'),
    });
  }
}
