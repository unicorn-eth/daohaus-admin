import { HAUS_RPC, Keychain, ValidNetwork } from '@/lib/keychain-utils';
import { ABI, createViemClient } from '@/lib/utils';

/**
 * Creates a read-only viem public client for contract calls.
 * Replaces the ethers v5 createEthersContract fallback.
 */
export const createViemReadClient = ({
  address,
  abi,
  chainId,
  rpcs = HAUS_RPC,
}: {
  address: string;
  abi: ABI;
  chainId: ValidNetwork;
  rpcs?: Keychain;
}) => {
  const client = createViemClient({ chainId, rpcs });
  return {
    client,
    read: (functionName: string, args: unknown[] = []) =>
      client.readContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args,
      }),
  };
};
