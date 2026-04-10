import { Bold, Button, H1, Link, ParLg, ParMd, useBreakpoint } from "@/lib/ui";
import { generateExplorerLink, ValidNetwork } from "@/lib/keychain-utils";
import { ReactSetter } from "@/lib/utils";
import { widthQuery } from "@/lib/ui/theme/global/breakpoints";

import { HausBlockLoading } from "./HausBlockLoading";
import { InfoSection } from "./FormLayouts";
import type { SummonState } from "./types";

type ErrorProps = {
  chainId?: string;
  daoAddress: string;
  txHash: string;
  setSummonState: ReactSetter<SummonState>;
  errMsg: string;
};

export const SummonError = ({
  chainId,
  daoAddress,
  txHash,
  setSummonState,
  errMsg,
}: ErrorProps) => {
  const isMobile = useBreakpoint(widthQuery.sm);

  const txUrl =
    chainId && txHash
      ? generateExplorerLink({
          chainId: chainId as ValidNetwork,
          address: txHash,
          type: "tx",
        })
      : undefined;

  const daoUrl =
    chainId && daoAddress
      ? generateExplorerLink({
          chainId: chainId as ValidNetwork,
          address: daoAddress,
          type: "address",
        })
      : undefined;

  return (
    <div>
      <H1 className="title">
        <Bold>Summon Error</Bold>
      </H1>
      <ParMd>
        Learn more about{" "}
        <Link href="https://daohaus.mirror.xyz/U_JQtheSzdpRFqQwf9Ow3LgLNG0WMZ6ibAyrjWDu_fc">
          Moloch v3
        </Link>
      </ParMd>
      <HausBlockLoading loading={false} />
      <InfoSection>
        <ParLg className="info">
          <Bold>Summon Failed:</Bold>
        </ParLg>
        {errMsg && <ParMd>{errMsg}</ParMd>}
        {txUrl && (
          <Link href={txUrl} showExternalIcon={false}>
            View Transaction
          </Link>
        )}
        {!txUrl && daoUrl && (
          <Link href={daoUrl} showExternalIcon={false}>
            View DAO Address
          </Link>
        )}
      </InfoSection>
      <Button
        color="secondary"
        onClick={() => setSummonState("idle")}
        fullWidth={isMobile}
      >
        Summon Another DAO
      </Button>
    </div>
  );
};
