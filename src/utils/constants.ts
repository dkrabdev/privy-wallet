import { sepolia } from 'viem/chains';
// import { inkSepolia } from 'viem/chains';

const zerodevProjectId = process.env['NEXT_PUBLIC_ZERODEV_PROJECT_ID'];

export const BUNDLER_URL = `https://rpc.zerodev.app/api/v2/bundler/${zerodevProjectId}`;
export const PAYMASTER_URL = `https://rpc.zerodev.app/api/v2/paymaster/${zerodevProjectId}`;
export const PASSKEY_SERVER_URL = `https://passkeys.zerodev.app/api/v3/${zerodevProjectId}`;

export const DEFAULT_CHAIN = sepolia;