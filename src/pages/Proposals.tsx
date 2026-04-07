import { useCurrentDao } from "@/hooks/useCurrentDao";
import { ProposalList } from "@/components/ProposalList";
import { Button } from "@/lib/ui";
import { Plus } from "lucide-react";

export const Proposals = () => {
  const { daoChain, daoId } = useCurrentDao();

  return (
    <ProposalList
      chainid={daoChain}
      daoid={daoId}
      rightActionEl={<Button IconLeft={Plus}>New Proposal</Button>}
    />
  );
};
