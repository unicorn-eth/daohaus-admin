import { useMemo } from "react";
import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";
import { ExternalLink } from "lucide-react";

import { H4, ParSm, ParXs, AddressDisplay, Tag, Loading } from "@/lib/ui";
import { getNetwork } from "@/lib/keychain-utils";
import { generateGnosisUiLink } from "@/lib/utils";
import type { ValidNetwork } from "@/lib/keychain-utils";
import { toWholeUnits, truncValue } from "@/lib/utils";
import type { VaultItem, DaoItem, TokenBalance } from "@/lib/dao-hooks";
import { useDaoTokenBalances } from "@/lib/dao-hooks";
import { SafeActionMenu } from "./SafeActionMenu";

// ── Styles ──────────────────────────────────────────────────────────────────

const SafeContainer = styled.div`
  width: 100%;
  margin-bottom: 3rem;
`;

const SafeOverviewCard = styled.div`
  background-color: ${({ theme }) => theme.secondary.step3};
  border-radius: 0.8rem;
  padding: 3rem;
  width: 100%;
`;

const SafeCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
  gap: 1.2rem;

  .right-section {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .safe-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    background-color: ${({ theme }) => theme.secondary.step5};
    border-radius: 4px;
    text-decoration: none;
    color: inherit;

    &:hover {
      background-color: ${({ theme }) => theme.secondary.step6};
    }
  }
`;

const TagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
`;

const TokenTable = styled.table`
  width: 100%;
  font-size: 1.4rem;
  border-collapse: collapse;
  margin-top: 1.6rem;
`;

const Th = styled.th`
  color: ${indigoDark.indigo11};
  border-bottom: 1px solid ${indigoDark.indigo5};
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid ${indigoDark.indigo4};
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TokenIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
`;

const TokenIconFallback = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${indigoDark.indigo6};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${indigoDark.indigo11};
`;

const FiatValue = styled.span`
  color: ${indigoDark.indigo11};
  font-size: 1.2rem;
  margin-left: 0.6rem;
`;

// ── Types ────────────────────────────────────────────────────────────────────

type GnosisTokenBalance = TokenBalance & {
  fiatBalance?: string;
  fiatConversion?: string;
};

type SafeCardProps = {
  dao: DaoItem;
  safe: VaultItem;
  daoChain: string;
  daoId: string;
};

// ── Component ────────────────────────────────────────────────────────────────

export const SafeCard = ({ dao, safe, daoChain, daoId }: SafeCardProps) => {
  const isTreasury = safe.safeAddress === dao.safeAddress;
  const { tokens, isLoading, isError } = useDaoTokenBalances({
    chainid: daoChain,
    safeAddress: safe.safeAddress,
  });

  const nativeSymbol = useMemo(() => {
    const network = getNetwork(daoChain);
    return network?.symbol ?? "ETH";
  }, [daoChain]);

  const gnosisLink = generateGnosisUiLink({
    chainId: daoChain as ValidNetwork,
    address: safe.safeAddress,
  });

  const rows = useMemo(() => {
    if (!tokens) return [];
    return (tokens as GnosisTokenBalance[]).map((t) => ({
      symbol: t.token?.symbol ?? nativeSymbol,
      name: t.token?.name ?? nativeSymbol,
      logoUri: t.token?.logoUri ?? null,
      balance: truncValue(toWholeUnits(t.balance, t.token?.decimals ?? 18), 4),
      fiatBalance: t.fiatBalance,
    }));
  }, [tokens, nativeSymbol]);

  console.log("safe", safe);

  return (
    <SafeContainer>
      <SafeOverviewCard>
        <SafeCardHeader>
          <div>
            <H4>{safe.name}</H4>
            <TagSection>
              <AddressDisplay
                address={safe.safeAddress}
                explorerNetworkId={daoChain as ValidNetwork}
                truncate
                copy
              />
              {isTreasury && <Tag tagColor="pink">Ragequittable</Tag>}
              {!safe.active && <Tag tagColor="red">Inactive</Tag>}
            </TagSection>
          </div>
          <div className="right-section">
            <a
              className="safe-link"
              href={gnosisLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ParXs>Safe App</ParXs>
              <ExternalLink size={12} />
            </a>
            <SafeActionMenu
              ragequittable={safe.ragequittable}
              safeAddress={safe.safeAddress}
              daoChain={daoChain}
              daoId={daoId}
            />
          </div>
        </SafeCardHeader>

        {isLoading && <Loading size={32} />}
        {isError && <ParSm>Unable to fetch token balances.</ParSm>}

        {!isLoading && !isError && tokens && (
          <>
            {rows.length === 0 ? (
              <ParSm>No token balances.</ParSm>
            ) : (
              <TokenTable>
                <thead>
                  <tr>
                    <Th>Asset</Th>
                    <Th>Balance</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <Td>
                        <TokenRow>
                          {row.logoUri ? (
                            <TokenIcon
                              src={row.logoUri}
                              alt={row.symbol}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <TokenIconFallback>
                              {row.symbol.slice(0, 2)}
                            </TokenIconFallback>
                          )}
                          {row.name}
                        </TokenRow>
                      </Td>
                      <Td>
                        {row.balance} {row.symbol}
                        {row.fiatBalance && Number(row.fiatBalance) > 0 && (
                          <FiatValue>
                            (${Number(row.fiatBalance).toFixed(2)})
                          </FiatValue>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TokenTable>
            )}
          </>
        )}
      </SafeOverviewCard>
    </SafeContainer>
  );
};
