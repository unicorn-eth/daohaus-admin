import { Link } from "react-router-dom";
import styled from "styled-components";

import { SingleColumnLayout, Loading, ParMd, Button } from "@/lib/ui";
import { useDao } from "@/lib/dao-hooks";
import { useCurrentDao } from "@/app/hooks/useCurrentDao";
import { MetadataSettings } from "@/features/settings/components/MetadataSettings";
import { ContractSettings } from "@/features/settings/components/ContractSettings";
import { GovernanceSettings } from "@/features/settings/components/GovernanceSettings";
import { TokenSettings } from "@/features/settings/components/TokenSettings";
import { ShamanList } from "@/features/settings/components/ShamanList";

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

export const Settings = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { dao, isLoading, isError } = useDao({ chainid: daoChain, daoid: daoId });

  return (
    <SingleColumnLayout
      title="Settings"
      actions={
        <ButtonLink to={`/molochv3/${daoChain}/${daoId}/settings/update`}>
          <Button variant="outline" color="secondary" size="sm">Edit Settings</Button>
        </ButtonLink>
      }
    >
      {isLoading && <Loading size={80} />}
      {isError && <ParMd>Failed to load settings.</ParMd>}
      {dao && (
        <>
          <MetadataSettings dao={dao} />
          <ContractSettings dao={dao} daoChain={daoChain} />
          <GovernanceSettings dao={dao} daoChain={daoChain} />
          <TokenSettings dao={dao} daoChain={daoChain} />
          <ShamanList dao={dao} daoChain={daoChain} />
        </>
      )}
    </SingleColumnLayout>
  );
};
