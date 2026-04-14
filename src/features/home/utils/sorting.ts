export type SortOption = {
  name: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
};

export const SORT_FIELDS: Record<string, SortOption> = {
  PROPOSALS: {
    name: 'Proposals',
    orderBy: 'proposalCount',
    orderDirection: 'desc',
  },
  MEMBERS: {
    name: 'Members',
    orderBy: 'activeMemberCount',
    orderDirection: 'desc',
  },
  NEWEST: {
    name: 'Newest',
    orderBy: 'createdAt',
    orderDirection: 'desc',
  },
  OLDEST: {
    name: 'Oldest',
    orderBy: 'createdAt',
    orderDirection: 'asc',
  },
};

export const sortOptions = Object.entries(SORT_FIELDS).map(([key, value]) => ({
  value: key,
  name: value.name,
}));

export const DEFAULT_SORT_KEY = 'PROPOSALS';
