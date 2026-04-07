import { ChangeEvent, ReactNode } from "react";
import styled from "styled-components";
import { LayoutGrid, List } from "lucide-react";
import { Button, SingleColumnLayout, ParSm, widthQuery } from "@/lib/ui";
import { SearchInput } from "./SearchInput";
import { SortDropdown } from "./SortDropdown";
import { sortOptions } from "@/utils/hub";

export const ListType = {
  Cards: "Cards",
  Table: "Table",
} as const;

export type ListType = (typeof ListType)[keyof typeof ListType];

type ListActionsProps = {
  children: ReactNode;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalDaos: number;
  sortBy: string;
  switchSortBy: (e: ChangeEvent<HTMLSelectElement>) => void;
  listType: ListType;
  toggleListType: () => void;
  networkName: string;
};

const ControlBar = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2.4rem;
  flex-wrap: wrap;
  gap: 1.2rem;
  align-items: center;

  .network-label {
    margin-right: auto;
  }

  @media ${widthQuery.sm} {
    flex-direction: column;
    align-items: flex-start;

    .list-toggle {
      display: none;
    }
  }
`;

export const ListActions = ({
  children,
  searchTerm,
  setSearchTerm,
  totalDaos,
  sortBy,
  switchSortBy,
  listType,
  toggleListType,
  networkName,
}: ListActionsProps) => {
  return (
    <SingleColumnLayout>
      <ControlBar>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalItems={totalDaos}
        />
        <ParSm className="network-label" style={{ alignSelf: "center" }}>
          Network: <strong>{networkName}</strong>
        </ParSm>

        <SortDropdown
          id="dao-sort"
          value={sortBy}
          options={sortOptions}
          onChange={switchSortBy}
        />
        <Button
          color="secondary"
          variant="outline"
          size="sm"
          className="list-toggle"
          onClick={toggleListType}
          IconLeft={listType === ListType.Table ? LayoutGrid : List}
        >
          {listType === ListType.Table ? "Card View" : "List View"}
        </Button>
      </ControlBar>
      {children}
    </SingleColumnLayout>
  );
};
