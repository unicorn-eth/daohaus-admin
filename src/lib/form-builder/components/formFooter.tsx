import styled, { useTheme } from 'styled-components';
import { Check, AlertTriangle } from 'lucide-react';
import { useChainId } from 'wagmi';

import { useFormBuilder } from '@/lib/form-builder/base';
import { Button, ParSm, Loading, Theme } from '@/lib/ui';
import { generateExplorerLink } from '@/lib/keychain-utils';
import { ValidNetwork } from '@/lib/keychain-utils';

enum StatusMsg {
  Compile = 'Compiling Transaction Data',
  Request = 'Requesting Signature',
  Await = 'Transaction Submitted',
  TxErr = 'Transaction Error',
  TxSuccess = 'Transaction Success',
  PollStart = 'Syncing TX (Subgraph)',
  PollSuccess = 'Success: TX Confirmed!',
  PollError = 'Sync Error (Subgraph)',
  NoContext = 'Missing TXBuilder Context',
}

const FooterBox = styled.div`
  a {
    margin-bottom: 1.6rem;
    display: block;
    color: ${({ theme }) => theme.secondary.step11};
  }
`;

const TxLink = styled.a`
  color: ${({ theme }) => theme.secondary.step11};
  text-decoration: underline;
`;

export const FormFooter = ({
  submitButtonText,
  status,
  txHash,
}: {
  submitDisabled?: boolean;
  submitButtonText?: string;
  status: StatusMsg | null;
  txHash: string | null;
}) => {
  const { submitDisabled } = useFormBuilder() || {};
  const wagmiChainId = useChainId();
  const chainIdHex = wagmiChainId
    ? `0x${wagmiChainId.toString(16)}`
    : undefined;

  const explorerUrl =
    txHash && chainIdHex
      ? generateExplorerLink({
          chainId: chainIdHex as ValidNetwork,
          address: txHash,
          type: 'tx',
        })
      : undefined;

  return (
    <FooterBox>
      {explorerUrl && (
        <TxLink href={explorerUrl} target="_blank" rel="noopener noreferrer">
          See Transaction Here
        </TxLink>
      )}
      {status && <FormStatusDisplay status={status} />}
      <Button fullWidth type="submit" disabled={submitDisabled}>
        {submitButtonText || 'Submit'}
      </Button>
    </FooterBox>
  );
};

const getStatusColor = (status: StatusMsg, theme: Theme) => {
  if (status === StatusMsg.PollSuccess) {
    return theme.success.step9;
  }
  if (
    status === StatusMsg.PollError ||
    status === StatusMsg.TxErr ||
    status === StatusMsg.NoContext
  ) {
    return theme.danger.step9;
  } else {
    return theme.secondary.step9;
  }
};

const getStatusElement = (status: StatusMsg, theme: Theme) => {
  if (status === StatusMsg.PollSuccess) {
    return <Check color={theme.success.step9} size={22.5} />;
  }
  if (
    status === StatusMsg.PollError ||
    status === StatusMsg.TxErr ||
    status === StatusMsg.NoContext
  ) {
    return <AlertTriangle color={theme.danger.step9} size={22.5} />;
  } else return <Loading size={22.5} />;
};

const StatusBox = styled.div<{ status: StatusMsg }>`
  border-radius: ${({ theme }) => theme['card'].radius};
  border: 1px ${({ theme, status }) => getStatusColor(status, theme as Theme)}
    solid;
  padding: 1.5rem;
  margin-bottom: 2rem;
  .inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: ${({ theme, status }) => getStatusColor(status, theme as Theme)};
      margin-right: auto;
    }
  }
`;

const FormStatusDisplay = ({ status }: { status: StatusMsg }) => {
  const theme = useTheme();
  return (
    <StatusBox status={status}>
      <div className="inner">
        <ParSm>{status}</ParSm>
        {getStatusElement(status, theme as Theme)}
      </div>
    </StatusBox>
  );
};
