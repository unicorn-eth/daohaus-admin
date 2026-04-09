import { LOCAL_ABI } from '@/lib/abis';
import { CONTRACT_KEYCHAINS } from '@/lib/keychain-utils';
import { ContractLego, TXLego, MaxUint256 } from '@/lib/utils';

const ERC_20_CONTRACT: ContractLego = {
  type: 'static',
  contractName: 'ERC20',
  abi: LOCAL_ABI.ERC20,
  targetAddress: '.tokenAddress',
};

export const APPROVE_TX: TXLego = {
  id: 'APPROVE_TOKEN',
  contract: ERC_20_CONTRACT,
  method: 'approve',
  args: [
    { type: 'singleton', keychain: CONTRACT_KEYCHAINS.TRIBUTE_MINION },
    { type: 'static', value: MaxUint256 },
  ],
};
