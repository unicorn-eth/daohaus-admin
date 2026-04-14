import { ChangeEvent, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import { Button, Loading } from "@/lib/ui";
import { EmptyState } from "./EmptyState";
import { useDaosForAddress } from "@/lib/dao-hooks";
import type { DaoItem, MemberItem } from "@/lib/dao-hooks";
import { toHexChainId, getNetworkName } from "@/utils/chainIds";
import { DEFAULT_SORT_KEY, SORT_FIELDS } from "@/utils/hub";
import { ListActions, ListType } from "./ListActions";
import { DaoCard } from "./DaoCard";
import { DaoTable } from "./DaoTable";

type DaoWithMember = DaoItem & { members: MemberItem[] };

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
`;


function sortDaos(daos: DaoWithMember[], sortKey: string): DaoWithMember[] {
  const field = SORT_FIELDS[sortKey];
  if (!field) return daos;

  return [...daos].sort((a, b) => {
    const aVal = Number(
      (a as unknown as Record<string, string>)[field.orderBy] ?? 0,
    );
    const bVal = Number(
      (b as unknown as Record<string, string>)[field.orderBy] ?? 0,
    );
    return field.orderDirection === "desc" ? bVal - aVal : aVal - bVal;
  });
}

export const HomeDashboard = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const hexChainId = toHexChainId(chainId) ?? "";
  const networkName = hexChainId ? getNetworkName(hexChainId) : "Unknown";

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_KEY);
  const [listType, setListType] = useState<ListType>(ListType.Cards);

  const { daos, isLoading, isError } = useDaosForAddress({
    chainid: hexChainId,
    address: address?.toLowerCase(),
  });

  const filtered = useMemo(() => {
    if (!daos) return [];
    const term = searchTerm.toLowerCase();
    const matching = term
      ? (daos as unknown as DaoWithMember[]).filter(
          (d) =>
            d.name?.toLowerCase().includes(term) ||
            d.id.toLowerCase().includes(term),
        )
      : (daos as unknown as DaoWithMember[]);
    return sortDaos(matching, sortBy);
  }, [daos, searchTerm, sortBy]);

  const switchSortBy = (e: ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value);
  const toggleListType = () =>
    setListType((prev) =>
      prev === ListType.Cards ? ListType.Table : ListType.Cards,
    );

  const controlProps = {
    searchTerm,
    setSearchTerm,
    totalDaos: filtered.length,
    sortBy,
    switchSortBy,
    listType,
    toggleListType,
    networkName,
  };

  if (isLoading) {
    return (
      <ListActions {...controlProps}>
        <Loading size={80} />
      </ListActions>
    );
  }

  if (isError) {
    return (
      <ListActions {...controlProps}>
        <EmptyState
          variant="error"
          title="Failed to load DAOs"
          description="There was a problem fetching your DAOs. Check your connection and try again."
        />
      </ListActions>
    );
  }

  if (!filtered.length) {
    return (
      <ListActions {...controlProps}>
        <EmptyState
          title={searchTerm ? "No DAOs match your search" : "No DAOs found"}
          description={
            searchTerm
              ? "Try a different search term."
              : "You are not a member of any DAOs on this network. Summon one to get started."
          }
          action={
            !searchTerm ? (
              <Button size="sm" color="secondary" asChild>
                <Link to="/summon">Summon a DAO</Link>
              </Button>
            ) : undefined
          }
        />
      </ListActions>
    );
  }

  return (
    <ListActions {...controlProps}>
      {listType === ListType.Cards ? (
        <CardGrid>
          {filtered.map((dao) => (
            <DaoCard key={dao.id} dao={dao} hexChainId={hexChainId} />
          ))}
        </CardGrid>
      ) : (
        <DaoTable daos={filtered} hexChainId={hexChainId} />
      )}
    </ListActions>
  );
};
