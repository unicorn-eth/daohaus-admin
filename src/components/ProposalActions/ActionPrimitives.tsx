import React, { useMemo, useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Gavel, ThumbsDown, ThumbsUp, Flame } from "lucide-react";
import { mintDark, tomatoDark } from "@radix-ui/colors";

import {
  GatedButton,
  Italic,
  ParMd,
  Tooltip,
  useBreakpoint,
  widthQuery,
} from "@/lib/ui";
import {
  checkHasQuorum,
  percentage,
  getGasCostEstimate,
  toWholeUnits,
} from "@/lib/utils";
import {
  HAUS_NETWORK_DATA,
  isValidNetwork,
  ValidNetwork,
} from "@/lib/keychain-utils";
import type { ProposalItem } from "@/lib/dao-hooks";

const TemplateBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .top-section {
    display: flex;
    margin-bottom: 2.4rem;
    justify-content: space-between;
    @media ${widthQuery.sm} {
      margin-bottom: 1.2rem;
    }
  }
  .middle-section {
    height: 100%;
    margin-bottom: auto;
    @media ${widthQuery.sm} {
      margin-bottom: 2rem;
    }
  }
  .bottom-section {
    margin-top: auto;
  }
`;

const QuorumBox = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 1.2rem;
  }
`;

const QuorumDisplay = ({
  yesPerc,
  daoQuorum,
}: {
  yesPerc: number | string;
  daoQuorum: number | string;
}) => {
  const theme = useTheme();
  return (
    <Tooltip
      triggerEl={
        <QuorumBox>
          <Gavel color={theme.secondary.step11} size="1.4rem" />
          <ParMd color={theme.secondary.step11}>
            {Number(yesPerc).toFixed(0)}/{daoQuorum}%
          </ParMd>
        </QuorumBox>
      }
      content={`DAO must meet a quorum of ${daoQuorum}% to pass a proposal.`}
      side="bottom"
    />
  );
};

const VerdictBox = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.6rem;
  }
`;

export const ProposalPass = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <VerdictBox>
      <ThumbsUp size="1.6rem" color={theme.secondary.step11} />
      <ParMd color={theme.secondary.step11}>{text}</ParMd>
    </VerdictBox>
  );
};

export const ProposalFail = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <VerdictBox>
      <ThumbsDown size="1.6rem" color={theme.secondary.step11} />
      <ParMd color={theme.secondary.step11}>{text}</ParMd>
    </VerdictBox>
  );
};

export const VoteStatus = ({ passing }: { passing: boolean }) => {
  return passing ? (
    <ProposalPass text="Proposal is Passing" />
  ) : (
    <ProposalFail text="Proposal is Failing" />
  );
};

export const VotingResults = ({
  isVoting,
  proposal,
}: {
  isVoting: boolean;
  proposal: ProposalItem;
}) => {
  const hasQuorum = checkHasQuorum({
    yesVotes: Number(proposal.yesBalance),
    totalShares: Number(proposal.dao.totalShares),
    quorumPercent: Number(proposal.dao.quorumPercent),
  });
  const didPass =
    Number(proposal.yesBalance) > Number(proposal.noBalance) && hasQuorum;
  return isVoting ? (
    <VoteStatus passing={didPass} />
  ) : (
    <>
      {didPass ? (
        <ProposalPass text="Proposal Passed" />
      ) : (
        <ProposalFail text="Proposal Failed" />
      )}
    </>
  );
};

export const ActionTemplate = ({
  helperDisplay,
  statusDisplay,
  main,
  proposal,
}: {
  helperDisplay?: string | React.ReactNode;
  statusDisplay?: string | React.ReactNode;
  main?: React.ReactNode;
  proposal: ProposalItem;
}) => {
  const theme = useTheme();
  const isMobile = useBreakpoint(widthQuery.sm);

  const displayUI = useMemo(() => {
    if (typeof statusDisplay === "string") {
      return <ParMd>{statusDisplay}</ParMd>;
    }
    return statusDisplay;
  }, [statusDisplay]);

  const helperUI = useMemo(() => {
    if (typeof helperDisplay === "string") {
      return (
        <ParMd color={theme.secondary.step11}>
          <Italic>{helperDisplay}</Italic>
        </ParMd>
      );
    }
    return helperDisplay;
  }, [helperDisplay, theme]);

  const hideQuorum = proposal.dao.quorumPercent === "0";
  const yesPerc = percentage(
    Number(proposal.yesBalance),
    Number(proposal.dao.totalShares),
  );

  return (
    <TemplateBox>
      <div className="top-section">
        {displayUI}
        {isMobile || hideQuorum || (
          <QuorumDisplay
            yesPerc={yesPerc}
            daoQuorum={proposal.dao.quorumPercent}
          />
        )}
      </div>
      <div className="middle-section">{main}</div>
      <div className="bottom-section">{helperUI}</div>
    </TemplateBox>
  );
};

export const VoteUpButton = styled(GatedButton)`
  background-color: ${mintDark.mint10};
  border: 1px solid ${mintDark.mint10};
  color: ${mintDark.mint1};
  min-width: 7rem;

  &:hover {
    background-color: ${mintDark.mint11};
    border: 1px solid ${mintDark.mint11};
  }
  :focus {
    background-color: ${mintDark.mint11};
    border: 1px solid ${mintDark.mint11};
  }
  :active {
    background-color: ${mintDark.mint10};
    border: 1px solid ${mintDark.mint10};
  }
  :disabled {
    background-color: ${mintDark.mint12};
    border: 1px solid ${mintDark.mint12};
  }
`;

export const VoteDownButton = styled(GatedButton)`
  background-color: ${tomatoDark.tomato10};
  border: 1px solid ${tomatoDark.tomato10};
  color: ${tomatoDark.tomato1};
  min-width: 7rem;

  &:hover {
    background-color: ${tomatoDark.tomato11};
    border: 1px solid ${tomatoDark.tomato11};
  }
  :focus {
    background-color: ${tomatoDark.tomato11};
    border: 1px solid ${tomatoDark.tomato11};
  }
  :active {
    background-color: ${tomatoDark.tomato10};
    border: 1px solid ${tomatoDark.tomato10};
  }
  :disabled {
    background-color: ${tomatoDark.tomato12};
    border: 1px solid ${tomatoDark.tomato12};
  }
`;

export const VoteBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Verdict = ({
  passed,
  appendText = "",
}: {
  passed: boolean;
  appendText?: string;
}) => {
  return passed ? (
    <ProposalPass text={`Proposal Passed${appendText}`} />
  ) : (
    <ProposalFail text={`Proposal Failed${appendText}`} />
  );
};

const GasBox = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 1.2rem;
    padding: 0;
  }
`;

export const GasDisplay = ({
  gasAmt,
  daoChain,
}: {
  gasAmt: string | number;
  daoChain: string;
}) => {
  const theme = useTheme();
  const [estimate, setEstimate] = useState<string | undefined>();

  useEffect(() => {
    if (!daoChain || !gasAmt || !isValidNetwork(daoChain)) return;
    const getGasEst = async () => {
      const est = await getGasCostEstimate(gasAmt, daoChain as ValidNetwork);
      if (est) {
        setEstimate(Number(toWholeUnits(est.toFixed())).toFixed(10));
      }
    };
    getGasEst();
  }, [daoChain, gasAmt]);

  const symbol = isValidNetwork(daoChain)
    ? HAUS_NETWORK_DATA[daoChain as ValidNetwork]?.symbol
    : undefined;

  return (
    <GasBox>
      <Flame color={theme.secondary.step11} size="1.4rem" />
      <ParMd color={theme.secondary.step11}>
        Gas estimate: {estimate ?? "…"} {symbol}
      </ParMd>
    </GasBox>
  );
};
