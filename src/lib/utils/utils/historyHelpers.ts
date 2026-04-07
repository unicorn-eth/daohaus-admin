import {
  formatDateTimeFromSeconds,
  formatDistanceToNowFromSeconds,
  formatPeriods,
  formatShortDateTimeFromSeconds,
  formatValueTo,
  fromWei,
} from '@/lib/utils';
import { PROPOSAL_STATUS } from '../constants/proposals';
import type { ProposalItem } from '@/lib/dao-hooks';
import type { NetworkConfig } from '@/lib/keychain-utils';
import type { ProposalStatus } from './proposalStatus';

export type ProposalHistoryElementData = {
  dataType: 'member' | 'dataIndicator';
  label: string;
  data: string;
};

export type ProposalHistoryElement = {
  title: string;
  active: boolean;
  text?: string;
  canExpand: boolean;
  dataElements?: ProposalHistoryElementData[];
  txHash?: string;
  showVotesButton?: boolean;
};

type ElementBuildArgs = {
  proposal: ProposalItem;
  status: ProposalStatus;
  networkData?: NetworkConfig | null;
};

export const buildProposalHistory = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] | null => {
  if (status === PROPOSAL_STATUS.unsponsored) {
    return buildUnsponsoredElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.cancelled) {
    return buildCancelledElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.voting) {
    return buildVotingElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.grace) {
    return buildGraceElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.needsProcessing) {
    return buildNeedsProcessingElements({ proposal, status, networkData });
  }
  if (
    status === PROPOSAL_STATUS.actionFailed ||
    status === PROPOSAL_STATUS.passed
  ) {
    return buildCompletedElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.failed) {
    return buildFailedElements({ proposal, status, networkData });
  }
  if (status === PROPOSAL_STATUS.expired) {
    return buildExpiredElements({ proposal, status, networkData });
  }

  return [{ title: 'Pending', active: false, canExpand: false }];
};

const buildExpiredElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  buildGracePast({ proposal, status }),
  {
    title: 'Proposal Expired',
    text: formatShortDateTimeFromSeconds(proposal.expiration),
    active: false,
    canExpand: false,
  },
];

const buildFailedElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  buildGracePast({ proposal, status }),
  { title: 'Proposal Failed', active: false, canExpand: false },
];

const buildCompletedElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  buildGracePast({ proposal, status }),
  {
    title: 'Proposal Complete',
    active: false,
    canExpand: true,
    dataElements: [
      { dataType: 'member', label: 'Executed By', data: proposal.processedBy || '--' },
    ],
    txHash: proposal.processTxHash,
  },
];

const buildNeedsProcessingElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  buildGracePast({ proposal, status }),
  {
    title: 'Proposal Complete',
    active: status === PROPOSAL_STATUS.needsProcessing,
    text: 'Waiting to be executed...',
    canExpand: false,
  },
];

const buildGraceElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  {
    title: 'Grace Period',
    active: status === PROPOSAL_STATUS.grace,
    text: `Grace period ends ${formatDistanceToNowFromSeconds(proposal.graceEnds)}`,
    canExpand: false,
  },
  buildCompletedFuture({ proposal, status }),
];

const buildVotingElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  {
    title: 'Voting in Progress',
    active: status === PROPOSAL_STATUS.voting,
    text: `${formatValueTo({
      value: Number(fromWei(proposal.yesBalance)),
      decimals: 2,
      format: 'numberShort',
    })} Yes / ${formatValueTo({
      value: Number(fromWei(proposal.noBalance)),
      decimals: 2,
      format: 'numberShort',
    })} No -- Voting ends ${formatDistanceToNowFromSeconds(proposal.votingEnds)}`,
    canExpand: false,
    showVotesButton: true,
  },
  buildCompletedFuture({ proposal, status }),
];

const buildCancelledElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  buildSponsored({ proposal, status }),
  buildVotingPast({ proposal, status }),
  { title: 'Proposal Cancelled', active: false, canExpand: false },
];

const buildUnsponsoredElements = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement[] => [
  buildSubmitted({ proposal, status, networkData }),
  { title: 'Waiting on Sponsor', active: false, canExpand: false },
  {
    title: 'Voting Period',
    text: `Voting will last ${formatPeriods(proposal.votingPeriod)}`,
    active: false,
    canExpand: false,
  },
  buildGraceFuture({ proposal, status }),
  buildCompletedFuture({ proposal, status }),
];

const buildGraceFuture = ({ proposal }: Pick<ElementBuildArgs, 'proposal'>): ProposalHistoryElement => ({
  title: 'Grace Period',
  text: `Grace will last ${formatPeriods(proposal.gracePeriod)}`,
  active: false,
  canExpand: false,
});

const buildGracePast = ({ proposal }: Pick<ElementBuildArgs, 'proposal'>): ProposalHistoryElement => ({
  title: 'Grace Period',
  active: false,
  text: formatDateTimeFromSeconds(proposal.graceEnds),
  canExpand: false,
});

const buildVotingPast = ({ proposal }: Pick<ElementBuildArgs, 'proposal'>): ProposalHistoryElement => ({
  title: 'Voting Complete',
  active: false,
  text: `${formatValueTo({
    value: Number(fromWei(proposal.yesBalance)),
    decimals: 2,
    format: 'numberShort',
  })} Yes / ${formatValueTo({
    value: Number(fromWei(proposal.noBalance)),
    decimals: 2,
    format: 'numberShort',
  })} No`,
  canExpand: false,
  showVotesButton: true,
});

const buildCompletedFuture = ({ proposal }: Pick<ElementBuildArgs, 'proposal'>): ProposalHistoryElement => ({
  title: 'Proposal Completion',
  text:
    proposal.expiration !== '0'
      ? `Proposal will expire on ${formatShortDateTimeFromSeconds(proposal.expiration)}`
      : undefined,
  active: false,
  canExpand: false,
});

const buildSponsored = ({ proposal }: Pick<ElementBuildArgs, 'proposal'>): ProposalHistoryElement => ({
  title: 'Sponsored',
  active: false,
  text: formatDateTimeFromSeconds(proposal.sponsorTxAt),
  canExpand: true,
  dataElements: [
    { dataType: 'member', label: 'Sponsored By', data: proposal.sponsor || '--' },
  ],
  txHash: proposal.sponsorTxHash,
});

const buildSubmitted = ({
  proposal,
  status,
  networkData,
}: ElementBuildArgs): ProposalHistoryElement => ({
  title: 'Submitted',
  active: status === PROPOSAL_STATUS.unsponsored,
  text: formatDateTimeFromSeconds(proposal.createdAt),
  canExpand: true,
  dataElements: [
    { dataType: 'member', label: 'Submitted By', data: proposal.createdBy },
    {
      dataType: 'dataIndicator',
      label: 'Proposal Offering',
      data: `${fromWei(proposal.proposalOffering)} ${networkData?.symbol ?? ''}`,
    },
  ],
  txHash: proposal.txHash,
});
