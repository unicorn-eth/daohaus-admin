import { CoreFieldLookup } from '@/lib/form-builder';
import { FieldLegoBase, FormLegoBase } from '@/lib/utils';

import { ProposalExpiry } from './ProposalExpiry';
import { TributeInput } from './TributeInput';
import { SelectApplicant } from './SelectApplicant';
import { RequestNativeToken } from './RequestNativeToken';
import { RequestERC20 } from './RequestERC20';
import { ShamanDeluxe } from './ShamanDeluxe';
import { TagsInput } from './TagsInput';
import { MarkdownField } from './MarkdownField';
import { ProposalOffering } from './ProposalOffering';
import { DelegateInput } from './DelegateInput';
import { RagequitToken } from './RagequitToken';
import { RagequitTokenList } from './RagequitTokenList';
import { WalletConnectLink } from './WalletConnectLink';
import { MetadataLink } from './MetadataLink';
import { SafeSelect } from './SafeSelect';
import { MultisendActions } from './MultisendActions';
import { AddressesAndAmounts } from './AddressesAndAmounts';
import { EpochDatePicker } from './EpochDatePicker';
import { TransferTokens } from './TransferTokens';

export const MolochFields = {
  ...CoreFieldLookup,
  proposalExpiry: ProposalExpiry,
  selectApplicant: SelectApplicant,
  tributeInput: TributeInput,
  requestNativeToken: RequestNativeToken,
  requestERC20: RequestERC20,
  shamanPermissionDeluxe: ShamanDeluxe,
  tagsInput: TagsInput,
  proposalOffering: ProposalOffering,
  delegateInput: DelegateInput,
  ragequitToken: RagequitToken,
  ragequitTokenList: RagequitTokenList,
  walletConnectLink: WalletConnectLink,
  metadataLink: MetadataLink,
  safeSelect: SafeSelect,
  multisendActions: MultisendActions,
  addressesAndAmounts: AddressesAndAmounts,
  epochDatePicker: EpochDatePicker,
  markdownField: MarkdownField,
  transferTokens: TransferTokens,
};

export type MolochFieldLego = FieldLegoBase<typeof MolochFields>;
export type MolochFormLego = FormLegoBase<typeof MolochFields>;
