import { useMemo } from "react";
import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";

import { Card, H5, ParMd, ParSm, AddressDisplay } from "@/lib/ui";
import { useDaoTokenBalances } from "@/lib/dao-hooks";
import type { DaoItem, MemberItem } from "@/lib/dao-hooks";
import type { ValidNetwork } from "@/lib/keychain-utils";
import { HAUS_NETWORK_DATA } from "@/lib/keychain-utils";
import { charLimit, formatValueTo, memberTokenBalanceShare } from "@/lib/utils";

const TokensCard = styled(Card)`
  border: none;
  padding: 2.8rem;
  margin-bottom: 3rem;
  width: 100%;
`;

const SectionTitle = styled(H5)`
  margin-bottom: 1.6rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid ${indigoDark.indigo5};
`;

const TokenTable = styled.table`
  width: 100%;
  font-size: 1.4rem;
  border-collapse: collapse;
`;

const Th = styled.th`
  color: ${indigoDark.indigo11};
  border-bottom: 1px solid ${indigoDark.indigo5};
  padding: 0.6rem 1rem 0.6rem 0;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem 1rem 1rem 0;
  vertical-align: middle;
`;

type MemberTokensProps = {
  member: MemberItem;
  dao: DaoItem;
  daoChain: string;
};

export const MemberTokens = ({ member, dao, daoChain }: MemberTokensProps) => {
  const { tokens, isLoading } = useDaoTokenBalances({
    chainid: daoChain,
    safeAddress: dao.safeAddress,
  });

  const nativeSymbol =
    HAUS_NETWORK_DATA[daoChain as ValidNetwork]?.symbol ?? "ETH";

  const tableData = useMemo(() => {
    if (!tokens || !tokens.length) return [];

    return tokens
      .filter((t) => t && Number(t.balance) > 0)
      .map((t) => {
        const decimals = t.token?.decimals ?? 18;
        const memberShare = memberTokenBalanceShare(
          t.balance,
          dao.totalShares,
          dao.totalLoot,
          member.shares,
          member.loot,
          decimals,
        );
        const name =
          t.tokenAddress === null
            ? nativeSymbol
            : charLimit(t.token?.name ?? t.tokenAddress ?? "Unknown", 24);

        return {
          address: t.tokenAddress,
          name,
          memberShare,
        };
      })
      .filter((row) => row.memberShare > 0);
  }, [tokens, dao, member, nativeSymbol]);

  if (isLoading) return null;
  if (!tableData.length) return null;

  return (
    <TokensCard>
      <SectionTitle>Token Balances</SectionTitle>
      <TokenTable>
        <thead>
          <tr>
            <Th>Token</Th>
            <Th>Member Share</Th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.address ?? "native"}>
              <Td>
                {row.address === null ? (
                  <ParMd>{row.name}</ParMd>
                ) : (
                  <AddressDisplay
                    address={row.address}
                    explorerNetworkId={daoChain as ValidNetwork}
                    textOverride={row.name}
                    truncate
                    copy
                  />
                )}
              </Td>
              <Td>
                <ParSm>
                  {formatValueTo({
                    value: row.memberShare,
                    decimals: 4,
                    format: "number",
                  })}
                </ParSm>
              </Td>
            </tr>
          ))}
        </tbody>
      </TokenTable>
    </TokensCard>
  );
};
