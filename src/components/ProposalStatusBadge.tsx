import { Tag } from '@/lib/ui';
import type { ProposalStatus } from '@/lib/utils';

type TagColor = 'blue' | 'green' | 'pink' | 'violet' | 'yellow' | 'red';

const STATUS_COLORS: Record<string, TagColor> = {
  Voting: 'blue',
  Grace: 'violet',
  'Ready for Execution': 'yellow',
  Passed: 'green',
  Failed: 'red',
  'Execution Failed': 'red',
  Cancelled: 'pink',
  Expired: 'yellow',
  Unsponsored: 'blue',
  Unknown: 'violet',
};

export const ProposalStatusBadge = ({ status }: { status: ProposalStatus }) => {
  const color = STATUS_COLORS[status] ?? 'violet';
  return <Tag tagColor={color}>{status}</Tag>;
};
