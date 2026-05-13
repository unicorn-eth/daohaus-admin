import { Plus } from 'lucide-react';

import { useCurrentDao } from '@/app/hooks/useCurrentDao';
import { Button, Dialog, DialogContent, DialogTrigger } from '@/lib/ui';
import {
  BASIC_PROPOSAL_FORMS,
  ADVANCED_PROPOSAL_FORMS,
} from '@/lib/legos';
import { ProposalList } from '@/features/proposal/components/ProposalList';
import { NewProposalList } from '@/features/proposal/components/NewProposalList';

export const Proposals = () => {
  const { daoChain, daoId } = useCurrentDao();

  return (
    <ProposalList
      chainid={daoChain}
      daoid={daoId}
      rightActionEl={
        <Dialog>
          <DialogTrigger asChild>
            <Button IconLeft={Plus}>New Proposal</Button>
          </DialogTrigger>
          <DialogContent title="New Proposal" description="Select proposal type">
            <NewProposalList
              basicProposals={Object.values(BASIC_PROPOSAL_FORMS)}
              advancedProposals={Object.values(ADVANCED_PROPOSAL_FORMS)}
            />
          </DialogContent>
        </Dialog>
      }
    />
  );
};
