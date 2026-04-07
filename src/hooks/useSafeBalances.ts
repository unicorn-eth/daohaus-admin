import { useQuery } from "@tanstack/react-query";
import type { TokenBalance } from "@/lib/dao-hooks";

const SAFE_API_BASE: Record<string, string> = {
  "0x1": "https://safe-transaction-mainnet.safe.global",
  "0x64": "https://safe-transaction-gnosis-chain.safe.global",
  "0xa": "https://safe-transaction-optimism.safe.global",
  "0xa4b1": "https://safe-transaction-arbitrum.safe.global",
  "0x2105": "https://safe-transaction-base.safe.global",
  "0xaa36a7": "https://safe-transaction-sepolia.safe.global",
};

export const useSafeBalances = ({
  chainid,
  safeAddress,
}: {
  chainid?: string;
  safeAddress?: string;
}) => {
  const base = chainid ? SAFE_API_BASE[chainid] : undefined;

  const { data, ...rest } = useQuery({
    queryKey: ["safe-balances", { chainid, safeAddress }],
    enabled: Boolean(base && safeAddress),
    queryFn: async (): Promise<{ tokens: TokenBalance[] }> => {
      const apiKey = import.meta.env.VITE_GNOSIS_SAFE_API_KEY;
      const headers: HeadersInit = apiKey
        ? { Authorization: `Token ${apiKey}` }
        : {};

      const res = await fetch(
        `${base}/api/v1/safes/${safeAddress}/balances/?trusted=false`,
        { headers }
      );

      if (!res.ok) {
        throw new Error(`Gnosis Safe API error: ${res.status}`);
      }

      const json = (await res.json()) as TokenBalance[];
      return { tokens: json };
    },
  });

  return { tokens: data?.tokens, ...rest };
};
