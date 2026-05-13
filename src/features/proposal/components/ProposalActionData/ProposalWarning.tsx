import { useMemo } from "react";

import { Link, ParXs } from "@/lib/ui";
import { PROPOSAL_TYPE_WARNINGS } from "@/lib/utils";
import { generateExplorerLink } from "@/lib/keychain-utils";
import type { ValidNetwork } from "@/lib/keychain-utils";

import {
  IconContainer,
  MessageContainer,
  Spacer,
  StyledParXs,
  WarningContainer,
  WarningIcon,
} from "./ProposalActionData.styles";
import type { ProposalActionConfig } from "./ProposalActionData";

type ProposalWarningProps = {
  proposalType?: string;
  decodeError?: boolean;
  txHash: string;
  proposalActionConfig?: ProposalActionConfig;
  daoChain: string;
};

export const ProposalWarning = ({
  proposalType,
  decodeError = false,
  txHash,
  proposalActionConfig,
  daoChain,
}: ProposalWarningProps) => {
  const warningMessage = useMemo(() => {
    if (decodeError) return PROPOSAL_TYPE_WARNINGS.ERROR_CANNOT_DECODE;
    return proposalType
      ? proposalActionConfig?.proposalTypeWarning?.[proposalType]
      : undefined;
  }, [proposalType, decodeError, proposalActionConfig]);

  const hasWarning =
    decodeError ||
    (proposalType &&
      proposalActionConfig?.sensitiveProposalTypes?.[proposalType]) ||
    warningMessage === PROPOSAL_TYPE_WARNINGS.ERROR_UNKOWN;

  const hasError = false;

  if (!hasWarning) return null;

  const explorerUrl =
    txHash &&
    generateExplorerLink({
      chainId: daoChain as ValidNetwork,
      address: txHash,
      type: "tx",
    });

  return (
    <WarningContainer
      className="container"
      $error={hasError}
      $warning={!!hasWarning}
    >
      <IconContainer>
        <WarningIcon />
      </IconContainer>
      <MessageContainer>
        <StyledParXs $error={hasError} $warning={!!hasWarning}>
          {warningMessage}
        </StyledParXs>
        {(decodeError || hasError) && explorerUrl && (
          <>
            <Spacer />
            <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ParXs>View Details</ParXs>
            </Link>
          </>
        )}
      </MessageContainer>
    </WarningContainer>
  );
};
