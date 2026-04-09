import { ReactNode, useState } from 'react';

import {
  AddressDisplay,
  Bold,
  DataSm,
  Divider,
  ParMd,
  Loading,
  useBreakpoint,
  widthQuery,
  ParLg,
  DataMd,
} from '@/lib/ui';
import {
  DAO_METHOD_TO_PROPOSAL_TYPE,
  PROPOSAL_TYPE_WARNINGS,
  SENSITIVE_PROPOSAL_TYPES,
} from '@/lib/utils';
import { isValidNetwork } from '@/lib/keychain-utils';
import type { ValidNetwork } from '@/lib/keychain-utils';
import type { ProposalItem } from '@/lib/dao-hooks';
import {
  isActionError,
} from '@/lib/tx-builder/utils/decoding';
import type {
  ActionError,
  DeepDecodedAction,
  DeepDecodedMultiTX,
} from '@/lib/tx-builder/utils/decoding';

import { ActionAlert } from './ActionAlert';
import {
  DisplayContainer,
  LoadingContainer,
  MainContainer,
  StyledDownArrow,
  StyledUpArrow,
  TitleContainer,
} from './ProposalActionData.styles';
import { ProposalWarning } from './ProposalWarning';
import { ValueDisplay } from './ValueDisplay';

export type ProposalActionConfig = {
  sensitiveProposalTypes?: Record<string, boolean>;
  actionToProposalType?: Record<string, string>;
  proposalTypeWarning?: Record<string, string>;
};

type ProposalActionDataProps = {
  daoChain: string;
  daoId: string;
  proposal: ProposalItem;
  proposalActionConfig?: ProposalActionConfig;
  actionData?: DeepDecodedMultiTX | null;
  decodeError: boolean;
};

export const ProposalActionData = ({
  daoChain,
  daoId,
  proposal,
  proposalActionConfig = {
    sensitiveProposalTypes: SENSITIVE_PROPOSAL_TYPES,
    actionToProposalType: DAO_METHOD_TO_PROPOSAL_TYPE,
    proposalTypeWarning: PROPOSAL_TYPE_WARNINGS,
  },
  actionData,
  decodeError = false,
}: ProposalActionDataProps) => {
  return (
    <MainContainer>
      <DisplayContainer>
        <TitleContainer>
          <ParMd>
            <Bold>All Actions</Bold>
          </ParMd>
          {!actionData && !decodeError && (
            <LoadingContainer>
              <Loading size={20} />
            </LoadingContainer>
          )}
        </TitleContainer>
        {actionData?.map((action, index) => (
          <div key={index}>
            <ActionSection
              index={index}
              action={action}
              daoId={daoId}
              daoChain={daoChain}
              proposal={proposal}
              proposalActionConfig={proposalActionConfig}
              actionHeader={`${index + 1}.`}
            />
            <SubActions
              daoChain={daoChain}
              daoId={daoId}
              proposal={proposal}
              proposalActionConfig={proposalActionConfig}
              action={action}
              index={index}
              actionHeader="-"
            />
          </div>
        ))}
      </DisplayContainer>
      {decodeError && (
        <ProposalWarning
          proposalType={proposal.proposalType}
          decodeError={decodeError}
          txHash={proposal.txHash ?? ''}
          proposalActionConfig={proposalActionConfig}
          daoChain={daoChain}
        />
      )}
    </MainContainer>
  );
};

const SubActions = ({
  action,
  index,
  actionHeader,
  daoChain,
  daoId,
  proposal,
  proposalActionConfig,
}: {
  action: DeepDecodedAction | ActionError;
  index: number;
  actionHeader: string;
  daoChain: string;
  daoId: string;
  proposal: ProposalItem;
  proposalActionConfig?: ProposalActionConfig;
}) => {
  if (
    isActionError(action) ||
    !action.decodedActions ||
    action.decodedActions.length === 0
  ) {
    return null;
  }

  return (
    <>
      {action.decodedActions.map((subAction, i) => (
        <div key={i}>
          <ActionSection
            daoChain={daoChain}
            daoId={daoId}
            proposal={proposal}
            proposalActionConfig={proposalActionConfig}
            action={subAction}
            index={index}
            actionHeader="-"
          />
          <SubActions
            daoChain={daoChain}
            daoId={daoId}
            proposal={proposal}
            proposalActionConfig={proposalActionConfig}
            action={subAction}
            index={index}
            actionHeader={actionHeader}
          />
        </div>
      ))}
    </>
  );
};

const ActionToggle = ({
  action,
  actionHeader,
  children,
}: {
  action: DeepDecodedAction | ActionError;
  actionHeader: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TitleContainer>
        <ParLg className="space">
          {actionHeader} {'name' in action ? action.name : 'Decoding Error'}
        </ParLg>
        <div onClick={() => setOpen((s) => !s)}>
          {open ? <StyledUpArrow /> : <StyledDownArrow />}
        </div>
      </TitleContainer>
      {open && <div className="data">{children}</div>}
    </>
  );
};

const ActionSectionError = ({
  action,
  actionHeader,
  daoChain,
  index,
  isMobile,
}: {
  action: ActionError;
  actionHeader: string;
  daoChain?: ValidNetwork;
  index: number;
  isMobile?: boolean;
}) => (
  <div className="display-segment data" key={`${action.message}-${index}`}>
    <ActionToggle actionHeader={actionHeader} action={action}>
      <>
        <DataMd className="space">Action {index + 1}</DataMd>
        <DataSm className="space">Error: {action.message}</DataSm>
        <Divider className="space" />
        {action.contractAddress && (
          <>
            <DataSm className="space"><Bold>TARGET</Bold></DataSm>
            <AddressDisplay
              className="space"
              address={action.contractAddress}
              copy
              explorerNetworkId={daoChain}
              truncate={isMobile}
            />
          </>
        )}
        <DataSm className="space"><Bold>HEX DATA:</Bold></DataSm>
        <DataSm className="space">{action.data}</DataSm>
        {action.value && (
          <>
            <DataSm className="space"><Bold>VALUE</Bold></DataSm>
            <DataSm className="space">{action.value}</DataSm>
          </>
        )}
      </>
    </ActionToggle>
  </div>
);

const ActionSection = ({
  action,
  index,
  actionHeader,
  daoChain,
  daoId,
  proposal,
  proposalActionConfig,
}: {
  action: DeepDecodedAction | ActionError;
  index: number;
  actionHeader: string;
  daoChain: string;
  daoId: string;
  proposal: ProposalItem;
  proposalActionConfig?: ProposalActionConfig;
}) => {
  const network = isValidNetwork(daoChain) ? daoChain : undefined;
  const isMobile = useBreakpoint(widthQuery.sm);

  if (isActionError(action)) {
    return (
      <ActionSectionError
        index={index}
        action={action}
        actionHeader={actionHeader}
        daoChain={network}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div className="display-segment" key={`action_${index}`}>
      <ActionToggle actionHeader={actionHeader} action={action}>
        <>
          <ActionAlert
            action={action}
            daoId={daoId}
            daoChain={daoChain}
            proposalType={proposal.proposalType}
            proposalActionConfig={proposalActionConfig}
          />
          <DataSm className="space"><Bold>TARGET</Bold></DataSm>
          <AddressDisplay
            className="space"
            address={action.to}
            copy
            explorerNetworkId={network}
            truncate={isMobile}
          />
          <DataSm className="space"><Bold>VALUE</Bold></DataSm>
          <DataSm className="space">{action.value}</DataSm>
          <Divider className="spaced-divider" />
          {action.params?.map((arg, i) => (
            <div className="data" key={`${arg.name}-${i}`}>
              <DataSm className="space">
                <Bold>PARAM{i + 1}: </Bold>{arg.name}
              </DataSm>
              <DataSm className="space">
                <Bold>TYPE: </Bold>{arg.type}
              </DataSm>
              <DataSm className="space"><Bold>VALUE: </Bold></DataSm>
              <ValueDisplay
                argValue={arg.value}
                argType={arg.type}
                network={network}
                isMobile={isMobile}
              />
              <Divider />
            </div>
          ))}
        </>
      </ActionToggle>
    </div>
  );
};
