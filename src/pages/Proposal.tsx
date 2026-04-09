import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { BiColumnLayout, Card, H5, Loading, ParMd, SingleColumnLayout, widthQuery } from "@/lib/ui";
import { useProposal } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/hooks/useCurrentDao";
import {
  getProposalTypeLabel,
  PROPOSAL_TYPE_LABELS,
} from "@/lib/utils";
import { deepDecodeProposalActions } from "@/lib/tx-builder/utils/deepDecoding";
import type { DeepDecodedMultiTX } from "@/lib/tx-builder/utils/decoding";
import { isValidNetwork } from "@/lib/keychain-utils";
import { ProposalDetailCard } from "@/components/ProposalDetailCard";
import { ProposalActions } from "@/components/ProposalActions/ProposalActions";
import { ProposalActionData } from "@/components/ProposalActionData/ProposalActionData";
import { ProposalHistory } from "@/components/ProposalHistory";
import { VoteList } from "@/components/VoteList";

const RightCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 45.7rem;
  padding: 2rem;
  border: none;
  margin-bottom: 3.4rem;
  height: fit-content;

  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondary.step5};
`;

export const Proposal = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { proposalId } = useParams<{ proposalId: string }>();

  const { proposal, isLoading, isError } = useProposal({
    chainid: daoChain,
    daoid: daoId,
    proposalid: proposalId,
  });

  const [actionData, setActionData] = useState<DeepDecodedMultiTX | null>(null);
  const [decodeError, setDecodeError] = useState(false);

  useEffect(() => {
    if (!proposal?.proposalData || !isValidNetwork(daoChain)) return;
    if (proposal.proposalData === '0x' || proposal.proposalData === '0x0') return;

    setActionData(null);
    setDecodeError(false);

    deepDecodeProposalActions({
      chainId: daoChain,
      actionData: proposal.proposalData,
    })
      .then((decoded) => setActionData(decoded))
      .catch(() => setDecodeError(true));
  }, [proposal?.proposalData, daoChain]);

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

  const typeLabel = getProposalTypeLabel(
    proposal.proposalType,
    PROPOSAL_TYPE_LABELS,
  );

  return (
    <BiColumnLayout
      title={proposal.title || "(No Title)"}
      subtitle={`${proposal.proposalId} | ${typeLabel}`}
      left={
        <div>
          <ProposalDetailCard
            proposal={proposal}
            daoChain={daoChain}
            daoId={daoId}
          />
          <ProposalActionData
            proposal={proposal}
            daoChain={daoChain}
            daoId={daoId}
            actionData={actionData}
            decodeError={decodeError}
          />
        </div>
      }
      right={
        <div>
          <RightCard>
            <ProposalActions
              proposal={proposal}
              daoChain={daoChain}
              daoId={daoId}
            />
            <Divider />
            <H5>Votes</H5>
            <VoteList proposal={proposal} />
          </RightCard>
          <ProposalHistory proposal={proposal} daoChain={daoChain} />
        </div>
      }
    />
  );
};
