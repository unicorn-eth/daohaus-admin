import { ProposalItem } from '@/lib/dao-hooks';
import { nowInSeconds } from './general';
import { checkHasQuorum } from './units';
import { PROPOSAL_STATUS } from '../constants/proposals';

export type ProposalStatus =
  | 'Unsponsored'
  | 'Voting'
  | 'Grace'
  | 'Expired'
  | 'Cancelled'
  | 'Ready for Execution'
  | 'Failed'
  | 'Passed'
  | 'Execution Failed'
  | 'Unknown';

const passedQuorum = (proposal: ProposalItem): boolean =>
  checkHasQuorum({
    yesVotes: Number(proposal.yesBalance),
    totalShares: Number(proposal.dao.totalShares),
    quorumPercent: Number(proposal.dao.quorumPercent),
  });

const isExpired = (proposal: ProposalItem): boolean =>
  Number(proposal.expiration) > 0 &&
  !proposal.cancelled &&
  Number(proposal.expiration) <
    Number(proposal.votingPeriod) +
      Number(proposal.gracePeriod) +
      nowInSeconds();

const isUnsponsored = (proposal: ProposalItem): boolean =>
  !proposal.sponsored && !proposal.cancelled && !isExpired(proposal);

const isInVoting = (proposal: ProposalItem): boolean => {
  const now = nowInSeconds();
  return Number(proposal.votingStarts) < now && Number(proposal.votingEnds) > now;
};

const isInGrace = (proposal: ProposalItem): boolean => {
  const now = nowInSeconds();
  return Number(proposal.votingEnds) < now && Number(proposal.graceEnds) > now;
};

const needsProcessing = (proposal: ProposalItem): boolean =>
  !proposal.processed &&
  proposal.sponsored &&
  !proposal.cancelled &&
  nowInSeconds() > Number(proposal.graceEnds) &&
  Number(proposal.yesBalance) > Number(proposal.noBalance);

const isFailed = (proposal: ProposalItem): boolean =>
  proposal.sponsored &&
  !proposal.cancelled &&
  nowInSeconds() > Number(proposal.graceEnds) &&
  (!passedQuorum(proposal) || Number(proposal.yesBalance) <= Number(proposal.noBalance));

const isMinRetentionFailure = (proposal: ProposalItem): boolean =>
  proposal.sponsored &&
  !proposal.cancelled &&
  proposal.processed &&
  !proposal.passed &&
  Number(proposal.dao.totalShares) <
    (Number(proposal.maxTotalSharesAndLootAtYesVote) *
      Number(proposal.dao.minRetentionPercent)) /
      100;

const isUnknownFailure = (proposal: ProposalItem): boolean =>
  proposal.sponsored && !proposal.cancelled && proposal.processed && !proposal.passed;

export const getProposalStatus = (proposal: ProposalItem): ProposalStatus => {
  if (isUnsponsored(proposal)) return PROPOSAL_STATUS['unsponsored'] as ProposalStatus;
  if (proposal.cancelled) return PROPOSAL_STATUS['cancelled'] as ProposalStatus;
  if (proposal.actionFailed) return PROPOSAL_STATUS['actionFailed'] as ProposalStatus;
  if (proposal.passed) return PROPOSAL_STATUS['passed'] as ProposalStatus;
  if (isInVoting(proposal)) return PROPOSAL_STATUS['voting'] as ProposalStatus;
  if (isInGrace(proposal)) return PROPOSAL_STATUS['grace'] as ProposalStatus;
  if (needsProcessing(proposal)) return PROPOSAL_STATUS['needsProcessing'] as ProposalStatus;
  if (isFailed(proposal)) return PROPOSAL_STATUS['failed'] as ProposalStatus;
  if (isExpired(proposal)) return PROPOSAL_STATUS['expired'] as ProposalStatus;
  if (isMinRetentionFailure(proposal)) return PROPOSAL_STATUS['failed'] as ProposalStatus;
  if (isUnknownFailure(proposal)) return PROPOSAL_STATUS['failed'] as ProposalStatus;
  return PROPOSAL_STATUS['unknown'] as ProposalStatus;
};

export const PROPOSAL_FILTER_LABELS: Record<string, string> = {
  unsponsored: 'Unsponsored',
  voting: 'In Voting',
  grace: 'In Grace',
  needsProcessing: 'Ready to Execute',
  passed: 'Passed',
  actionFailed: 'Action Failed',
  failed: 'Defeated',
  expired: 'Expired',
};

/** Returns true if the proposal matches the given filter key (or if no filter). */
export const matchesStatusFilter = (
  proposal: ProposalItem,
  filterKey: string
): boolean => {
  if (!filterKey) return true;
  const status = getProposalStatus(proposal);
  return status === PROPOSAL_STATUS[filterKey];
};
