import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

import {
  AddressDisplay,
  Bold,
  Button,
  H1,
  Link,
  ParMd,
  useBreakpoint,
} from "@/lib/ui";
import { Keychain } from "@/lib/keychain-utils";
import { ReactSetter } from "@/lib/utils";
import { widthQuery } from "@/lib/ui/theme/global/breakpoints";

import { HausBlockLoading } from "./HausBlockLoading";
import { InfoSection } from "./FormLayouts";
import type { SummonState } from "./types";

type SuccessProps = {
  daoAddress: string;
  chainId?: string;
  setSummonState: ReactSetter<SummonState>;
};

const AddressInfoSection = styled(InfoSection)`
  p,
  div {
    margin-bottom: 1rem;
  }

  a {
    margin-bottom: 1rem;
    align-items: flex-start;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 3rem;

  @media ${widthQuery.sm} {
    flex-direction: column;
  }
`;

const InternalLink = styled(RouterLink)`
  text-decoration: none;
`;

export const SummonerSuccess = ({
  daoAddress,
  chainId,
  setSummonState,
}: SuccessProps) => {
  const isMobile = useBreakpoint(widthQuery.sm);

  return (
    <div>
      <H1 className="title">
        <Bold>DAO Summoned</Bold>
      </H1>
      <ParMd>
        Learn more about{" "}
        <Link href="https://daohaus.mirror.xyz/U_JQtheSzdpRFqQwf9Ow3LgLNG0WMZ6ibAyrjWDu_fc">
          Moloch v3
        </Link>
      </ParMd>
      <HausBlockLoading loading={false} />
      <AddressInfoSection>
        <ParMd className="info">DAO contract:</ParMd>
        {chainId && (
          <AddressDisplay
            address={daoAddress}
            copy
            explorerNetworkId={chainId as keyof Keychain}
            truncate={isMobile}
          />
        )}
      </AddressInfoSection>
      <ButtonGroup>
        <Button
          color="secondary"
          onClick={() => setSummonState("idle")}
          fullWidth={isMobile}
        >
          <Bold>Summon Another DAO</Bold>
        </Button>
        {chainId && (
          <InternalLink to={`/molochv3/${chainId}/${daoAddress}`}>
            <Button fullWidth={isMobile}>View DAO</Button>
          </InternalLink>
        )}
      </ButtonGroup>
    </div>
  );
};
