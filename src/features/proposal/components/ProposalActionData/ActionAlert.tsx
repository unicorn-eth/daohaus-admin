import type { DeepDecodedAction } from '@/lib/tx-builder/utils/decoding';

import { AlertContainer } from './ProposalActionData.styles';
import { ProposalWarning } from './ProposalWarning';
import type { ProposalActionConfig } from './ProposalActionData';

export const ActionAlert = ({
  action,
  daoId,
  proposalType,
  proposalActionConfig,
  daoChain,
}: {
  action: DeepDecodedAction;
  daoId?: string;
  proposalType?: string;
  proposalActionConfig?: ProposalActionConfig;
  daoChain: string;
}) => {
  const actionType = proposalActionConfig?.actionToProposalType?.[action.name];

  if (
    actionType &&
    proposalType &&
    (action.to === daoId || proposalType !== actionType) &&
    proposalActionConfig?.sensitiveProposalTypes?.[actionType]
  ) {
    return (
      <AlertContainer>
        <ProposalWarning
          proposalActionConfig={proposalActionConfig}
          proposalType={actionType}
          txHash=""
          daoChain={daoChain}
        />
      </AlertContainer>
    );
  }
  return null;
};
