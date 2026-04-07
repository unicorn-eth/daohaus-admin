import { useParams } from "react-router-dom";

import { BiColumnLayout, Loading, ParMd, SingleColumnLayout } from "@/lib/ui";
import { useProposal } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/hooks/useCurrentDao";
import {
  getProposalStatus,
  getProposalTypeLabel,
  PROPOSAL_TYPE_LABELS,
} from "@/lib/utils";
import { ProposalDetailCard } from "@/components/ProposalDetailCard";
import { ProposalActions } from "@/components/ProposalActions";

export const Proposal = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { proposalId } = useParams<{ proposalId: string }>();

  const { proposal, isLoading, isError } = useProposal({
    chainid: daoChain,
    daoid: daoId,
    proposalid: proposalId,
  });

  if (isLoading) {
    return (
      <SingleColumnLayout>
        <Loading size={80} />
      </SingleColumnLayout>
    );
  }

  if (isError || !proposal) {
    return (
      <SingleColumnLayout>
        <ParMd>Proposal not found.</ParMd>
      </SingleColumnLayout>
    );
  }

  const status = getProposalStatus(proposal);
  const typeLabel = getProposalTypeLabel(proposal.proposalType, PROPOSAL_TYPE_LABELS);

  return (
    <BiColumnLayout
      title={proposal.title || "(No Title)"}
      subtitle={`${proposal.proposalId} | ${typeLabel}`}
      left={
        <ProposalDetailCard
          proposal={proposal}
          daoChain={daoChain}
          daoId={daoId}
        />
      }
      right={
        <ProposalActions proposal={proposal} status={status} detailed />
      }
    />
  );
};
