import { MouseEvent, useState } from "react";
import { Check, Filter } from "lucide-react";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";

import {
  Button,
  Loading,
  SingleColumnLayout,
  widthQuery,
  DropdownMenu,
  DropdownButtonTrigger,
  DropdownContent,
  DropdownItem,
} from "@/lib/ui";
import { useDaoProposals } from "@/lib/dao-hooks";
import { PROPOSAL_FILTER_LABELS, matchesStatusFilter } from "@/lib/utils";
import { SearchInput } from "@/app/components/SearchInput";
import { ProposalCard } from "./ProposalCard";
import { EmptyState } from "@/app/components/EmptyState";

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;

  @media ${widthQuery.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchFilterRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  align-items: center;
`;

const PAGE_SIZE = 10;

type ProposalListProps = {
  chainid: string;
  daoid: string;
  rightActionEl?: React.ReactNode;
};

export const ProposalList = ({
  chainid,
  daoid,
  rightActionEl,
}: ProposalListProps) => {
  const navigate = useNavigate();
  const { proposals, isLoading, isError } = useDaoProposals({
    chainid,
    daoid,
    queryOptions: {
      first: 200,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  });

  // console.log("proposals", proposals);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setVisibleCount(PAGE_SIZE);
  };

  const handleToggleFilter = (e: MouseEvent<HTMLButtonElement>) => {
    const val = e.currentTarget.value;
    setFilterKey((prev) => (prev === val ? "" : val));
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = proposals?.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesStatusFilter(p, filterKey);
  });

  const visible = filtered?.slice(0, visibleCount);
  const hasMore = (filtered?.length ?? 0) > visibleCount;

  return (
    <SingleColumnLayout title="Proposals">
      <ActionsBar>
        <SearchFilterRow>
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={handleSetSearchTerm}
            totalItems={filtered?.length ?? 0}
            singular="proposal"
            plural="proposals"
          />

          <DropdownMenu>
            <DropdownButtonTrigger color="secondary" IconLeft={Filter}>
              {filterKey ? PROPOSAL_FILTER_LABELS[filterKey] : "Filter"}
            </DropdownButtonTrigger>
            <DropdownContent align="start">
              {Object.entries(PROPOSAL_FILTER_LABELS).map(([key, label]) => (
                <DropdownItem asChild key={key}>
                  <Button
                    color="secondary"
                    justify="flex-start"
                    fullWidth
                    value={key}
                    onClick={handleToggleFilter}
                    IconRight={filterKey === key ? Check : undefined}
                  >
                    {label}
                  </Button>
                </DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
        </SearchFilterRow>

        {rightActionEl}
      </ActionsBar>

      {isLoading && <Loading size={80} />}
      {isError && (
        <EmptyState
          variant="error"
          title="Failed to load proposals"
          description="There was a problem fetching proposals. Check your connection and try again."
        />
      )}
      {!isLoading && !isError && (!filtered || filtered.length === 0) && (
        searchTerm || filterKey ? (
          <EmptyState
            title="No proposals match your search"
            description="Try a different search term or clear the filter."
            action={
              <Button
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => { handleSetSearchTerm(""); setFilterKey(""); }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No proposals yet"
            description="New proposals will appear here once they are submitted."
            action={
              <Button
                size="sm"
                color="secondary"
                onClick={() => navigate(`/molochv3/${chainid}/${daoid}/new-proposal`)}
              >
                New Proposal
              </Button>
            }
          />
        )
      )}

      {visible?.map((proposal) => (
        <ProposalCard
          key={proposal.proposalId}
          proposal={proposal}
          daoChain={chainid}
          daoId={daoid}
        />
      ))}

      {hasMore && (
        <Button
          variant="outline"
          color="secondary"
          size="sm"
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
        >
          Show More Proposals
        </Button>
      )}
    </SingleColumnLayout>
  );
};
