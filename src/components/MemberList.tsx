import { useState } from "react";
import styled from "styled-components";
import { indigoDark } from "@radix-ui/colors";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import {
  Card,
  DataIndicator,
  SingleColumnLayout,
  Loading,
  Button,
  widthQuery,
} from "@/lib/ui";
import { EmptyState } from "./EmptyState";
import { useDaoMembers, useDao } from "@/lib/dao-hooks";
import type { MemberItem } from "@/lib/dao-hooks";
import { charLimit, formatValueTo, fromWei } from "@/lib/utils";
import { MemberRow } from "./MemberRow";

type SortKey = "createdAt" | "delegateShares" | "shares" | "loot";
type SortDir = "asc" | "desc";

function sortMembers(
  members: MemberItem[],
  key: SortKey,
  dir: SortDir,
): MemberItem[] {
  return [...members].sort((a, b) => {
    const aVal = Number(a[key]);
    const bVal = Number(b[key]);
    return dir === "asc" ? aVal - bVal : bVal - aVal;
  });
}

const OverviewCard = styled(Card)`
  background-color: ${({ theme }) => theme.secondary.step3};
  border: none;
  padding: 3rem;
  width: 100%;
  margin-bottom: 3rem;
`;

const DataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0;
  div {
    padding: 2rem 0;
    width: 19.7rem;
    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

const TableCard = styled(Card)`
  border: none;
  padding: 3rem;
  width: 100%;
  overflow-x: auto;
  margin-bottom: 3rem;
`;

const Table = styled.table`
  width: 100%;
  font-size: 1.4rem;
  line-height: 2.2rem;
  border-collapse: collapse;
`;

const Th = styled.th`
  color: ${indigoDark.indigo11};
  border-bottom: 1px solid ${indigoDark.indigo5};
  padding: 0.6rem 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;

  &.hide-sm {
    @media ${widthQuery.md} {
      display: none;
    }
  }
`;

const SortButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: inherit;
  font-weight: inherit;

  &:hover {
    color: ${indigoDark.indigo12};
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;
  }
`;

const PAGE_SIZE = 20;

type MemberListProps = {
  chainid: string;
  daoid: string;
  allowLinks?: boolean;
  rightActionEl?: React.ReactNode;
};

export const MemberList = ({
  chainid,
  daoid,
  allowLinks = false,
  rightActionEl,
}: MemberListProps) => {
  const { dao } = useDao({ chainid, daoid });
  const { members, isLoading, isError } = useDaoMembers({ chainid, daoid });

  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = members;
  const sorted = filtered ? sortMembers(filtered, sortKey, sortDir) : filtered;
  const visible = sorted?.slice(0, visibleCount);
  const hasMore = (sorted?.length ?? 0) > visibleCount;

  return (
    <SingleColumnLayout title="Members" actions={rightActionEl}>
      {dao && (
        <OverviewCard>
          <DataGrid>
            <DataIndicator label="Token Holders" data={dao.activeMemberCount} />
            <DataIndicator
              label="Shamans"
              data={String(dao.shamen?.length ?? 0)}
            />
            <DataIndicator
              label={charLimit(dao.shareTokenName, 12)}
              data={formatValueTo({
                value: fromWei(dao.totalShares),
                decimals: 2,
                format: "numberShort",
              })}
            />
            <DataIndicator
              label={charLimit(dao.lootTokenName, 12)}
              data={formatValueTo({
                value: fromWei(dao.totalLoot),
                decimals: 2,
                format: "numberShort",
              })}
            />
          </DataGrid>
        </OverviewCard>
      )}

      {isLoading && <Loading size={80} />}
      {isError && (
        <EmptyState
          variant="error"
          title="Failed to load members"
          description="There was a problem fetching members. Check your connection and try again."
        />
      )}
      {!isLoading && !isError && (!sorted || sorted.length === 0) && (
        <EmptyState
          title="No members found"
          description="Members who hold voting or non-voting tokens will appear here."
        />
      )}

      {!isLoading && visible && visible.length > 0 && (
        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Member</Th>
                <Th className="hide-sm">
                  <SortButton onClick={() => handleSort("createdAt")}>
                    Join Date
                    {sortKey === "createdAt" ? (
                      sortDir === "desc" ? (
                        <ArrowDown />
                      ) : (
                        <ArrowUp />
                      )
                    ) : (
                      <ArrowUpDown />
                    )}
                  </SortButton>
                </Th>
                <Th className="hide-sm">
                  <SortButton onClick={() => handleSort("delegateShares")}>
                    Power
                    {sortKey === "delegateShares" ? (
                      sortDir === "desc" ? (
                        <ArrowDown />
                      ) : (
                        <ArrowUp />
                      )
                    ) : (
                      <ArrowUpDown />
                    )}
                  </SortButton>
                </Th>
                <Th className="hide-sm">Delegating To</Th>
                <Th>
                  <SortButton onClick={() => handleSort("shares")}>
                    Voting
                    {sortKey === "shares" ? (
                      sortDir === "desc" ? (
                        <ArrowDown />
                      ) : (
                        <ArrowUp />
                      )
                    ) : (
                      <ArrowUpDown />
                    )}
                  </SortButton>
                </Th>
                <Th>
                  <SortButton onClick={() => handleSort("loot")}>
                    Non-Voting
                    {sortKey === "loot" ? (
                      sortDir === "desc" ? (
                        <ArrowDown />
                      ) : (
                        <ArrowUp />
                      )
                    ) : (
                      <ArrowUpDown />
                    )}
                  </SortButton>
                </Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {visible.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  daoChain={chainid}
                  daoId={daoid}
                  totalShares={dao?.totalShares ?? "0"}
                  allowLinks={allowLinks}
                />
              ))}
            </tbody>
          </Table>
        </TableCard>
      )}

      {hasMore && (
        <Button
          variant="outline"
          color="secondary"
          size="sm"
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
        >
          Show More Members
        </Button>
      )}
    </SingleColumnLayout>
  );
};
